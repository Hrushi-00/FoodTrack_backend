
// import MealToken from "../models/mealTokenModel.js";

// tokenController.js
import PDFDocument from "pdfkit";
import Token from "../models/mealTokenModel.js";
import User from "../models/userModel.js"; 

export const generateToken = async (req, res) => {
  try {
    const { userId, mealType, items } = req.body;

    const today = new Date().toISOString().split("T")[0];

    // 1️⃣ Find last token for this user today
    const lastToken = await Token.findOne({ userId, date: today }).sort({ tokenNumber: -1 });
    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    // 2️⃣ Fetch user to get hotel name
    // const user = await User.findById(userId);
    // const hotelName = user?.hotelName || "Hotel";

    // 3️⃣ Save token
    const token = new Token({
      userId,
      date: today,
      mealType,
      tokenNumber,
      items,
    });
    await token.save();
// populate user (hotelName)
const savedToken = await Token.findById(token._id).populate("userId", "hotelName");
const hotelName = savedToken.userId.hotelName || "Hotel";
    // 4️⃣ Totals
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const tax = subtotal * 0.1; // 10% tax, change as needed
    const grandTotal = subtotal + tax;

    // 5️⃣ Create PDF
    const doc = new PDFDocument({
      size: [226, 600], // 58mm roll ~ 226pt wide (80mm roll ~ 302pt)
      margin: 10,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=token.pdf");
    doc.pipe(res);

    // 🏨 Hotel Name
    doc.fontSize(14).text(hotelName, { align: "center", bold: true });
    doc.moveDown(0.5);

    // 📅 Date / 🕒 Time / 🍽 Meal Type / 🎟 Token Number
    doc.fontSize(9).text(`Date: ${today}`);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`);
    doc.text(`Meal: ${mealType}`);
    doc.text(`Token No: ${tokenNumber}`);
    doc.moveDown();

    // 🧾 Items table
    doc.fontSize(10).text("Item", 10, doc.y, { continued: true });
    doc.text("Qty", 100, doc.y, { continued: true });
    doc.text("Price", 140, doc.y, { continued: true });
    doc.text("Total", 180, doc.y);
    doc.moveDown(0.2);
    doc.text("----------------------------------------");

    items.forEach((i) => {
      doc.text(i.name, 10, doc.y, { continued: true });
      doc.text(i.qty.toString(), 100, doc.y, { continued: true });
      doc.text(i.price.toFixed(2), 140, doc.y, { continued: true });
      doc.text((i.qty * i.price).toFixed(2), 180, doc.y);
    });

    doc.text("----------------------------------------");
    doc.moveDown(0.3);

    // 💵 Totals
    doc.text(`Subtotal: ${subtotal.toFixed(2)}`, { align: "right" });
    doc.text(`Tax: ${tax.toFixed(2)}`, { align: "right" });
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, { align: "right" });

    doc.moveDown();
    doc.fontSize(10).text("Thank you!", { align: "center" });
    doc.text("Please Come Again", { align: "center" });

    doc.end();
  } catch (error) {
    res.status(500).json({
      message: "Error generating token",
      error: error.message,
    });
  }
};


// Get all tokens for a specific date
export const getTokensByDate = async (req, res) => {
  try {
    const { date } = req.params; // /tokens/2025-08-22
    const tokens = await Token.find({ date }).populate("userId", "name email");

    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching tokens", error: error.message });
  }
};

// Get one user’s tokens
export const getUserTokens = async (req, res) => {
  try {
    const { userId } = req.params;
    const tokens = await Token.find({ userId });

    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user tokens", error: error.message });
  }
};
