// mealTokenController.js
import PDFDocument from "pdfkit";
import Token from "../models/mealTokenModel.js";
import User from "../models/userModel.js";

export const generateToken = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { mealType, items, tableNumber } = req.body;

    const today = new Date().toISOString().split("T")[0];

    // 1️⃣ Find last token for this admin today
    const lastToken = await Token.findOne({ adminId, date: today, mealType })
      .sort({ tokenNumber: -1 });

    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    // 2️⃣ Save token in DB
    const token = new Token({
      adminId,
      date: today,
      mealType,
      tokenNumber,
      items,
      tableNumber,
      hotelName: req.user.hotelName || "Hotel",
      address: req.user.address || "Address",
      phone: req.user.phone || "Phone",
    });

    await token.save();

    // 3️⃣ Calculate totals
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const tax = subtotal * 0.1; // 10% GST
    const grandTotal = subtotal + tax;

    // 4️⃣ Setup PDF Response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=token.pdf");

    const doc = new PDFDocument({ size: [226, 600], margin: 10 });
    doc.pipe(res);

    // --- HEADER ---
    doc.font("Helvetica-Bold").fontSize(14).text(req.user.hotelName || "Hotel", { align: "center" });
    doc.font("Helvetica").fontSize(10).text(req.user.address || "Address", { align: "center" });
    doc.font("Helvetica").fontSize(10).text(req.user.phone || "Phone", { align: "center" });
    doc.moveDown(0.5);

    doc.fontSize(9).text(`Date: ${today}`);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`);
    doc.text(`Table No: ${tableNumber}`);
    doc.text(`Meal: ${mealType}`);
    doc.text(`Token No: ${tokenNumber}`);
    doc.moveDown();

    // --- TABLE HEADERS ---
    const colWidths = { name: 80, qty: 30, price: 40, total: 50 };
    const startX = 10;
    let y = doc.y;

    doc.font("Helvetica-Bold").fontSize(9);
    doc.text("Item", startX, y, { width: colWidths.name, continued: true });
    doc.text("Qty", startX + colWidths.name, y, { width: colWidths.qty, align: "right", continued: true });
    doc.text("Price", startX + colWidths.name + colWidths.qty, y, { width: colWidths.price, align: "right", continued: true });
    doc.text("Total", startX + colWidths.name + colWidths.qty + colWidths.price, y, { width: colWidths.total, align: "right" });

    doc.moveDown(0.2);
    doc.font("Helvetica").text("------------------------------------------------------");

    // --- ITEMS ---
    doc.font("Helvetica").fontSize(9);
    items.forEach((i) => {
      y = doc.y;
      doc.text(i.name, startX, y, { width: colWidths.name, ellipsis: true, continued: true });
      doc.text(i.qty.toString(), startX + colWidths.name, y, { width: colWidths.qty, align: "right", continued: true });
      doc.text(i.price.toFixed(2), startX + colWidths.name + colWidths.qty, y, { width: colWidths.price, align: "right", continued: true });
      doc.text((i.qty * i.price).toFixed(2), startX + colWidths.name + colWidths.qty + colWidths.price, y, { width: colWidths.total, align: "right" });
    });

    doc.moveDown(0.2);
    doc.text("------------------------------------------------------");

    // --- TOTALS ---
    doc.font("Helvetica-Bold");
    doc.text(`Subtotal: ${subtotal.toFixed(2)}`, { align: "right" });
    doc.text(`Tax (10%): ${tax.toFixed(2)}`, { align: "right" });
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, { align: "right" });

    // --- FOOTER ---
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(10).text("Thank you!", { align: "center" });
    doc.font("Helvetica").text("Please Come Again", { align: "center" });

    // ✅ End PDF
    doc.end();

  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        message: "Error generating token",
        error: error.message,
      });
    } else {
      console.error("Error after response sent:", error.message);
    }
  }
};






// ✅ Get all tokens for a specific date (JWT based)
export const getTokensByDate = async (req, res) => {
  try {
    const { year, month, day } = req.params;
    const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD

    const { _id: adminId } = req.user; // from JWT

    const tokens = await Token.find({ date: formattedDate, adminId })
      .populate("adminId", "name email hotelName");

    if (!tokens.length) {
      return res.status(404).json({ message: "No tokens found for this date" });
    }

    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching tokens",
      error: error.message,
    });
  }
};


export const getMyTokens = async (req, res) => {
  try {
    // Get adminId from JWT
    const { _id: adminId } = req.user;

    const tokens = await Token.find({ adminId });

    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching user tokens",
      error: error.message,
    });
  }
};
