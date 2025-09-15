import Menu from "../models/menuModel.js";

// Add new menu (specific to user)
  export const addMenu = async (req, res) => {
    try {
      const { date, breakfast, lunch, dinner } = req.body;
      const userId = req.user._id; // from logged-in user

      const existingMenu = await Menu.findOne({ userId, date });
      if (existingMenu) {
        return res.status(400).json({ message: "Menu already exists for this date" });
      }

      const menu = new Menu({ userId, date, breakfast, lunch, dinner });
      await menu.save();

      res.status(201).json({ message: "Menu added successfully", menu });
    } catch (error) {
      res.status(500).json({ message: "Error adding menu", error: error.message });
    }
  };

// Update menu (specific to user)
export const updateMenu = async (req, res) => {
  try {
    const { date } = req.params;
    const { breakfast, lunch, dinner } = req.body;
    const userId = req.user._id;

    const updatedMenu = await Menu.findOneAndUpdate(
      { userId, date },
      { breakfast, lunch, dinner },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found for this date" });
    }

    res.status(200).json({ message: "Menu updated successfully", updatedMenu });
  } catch (error) {
    res.status(500).json({ message: "Error updating menu", error: error.message });
  }
};

// Get menu by date (only for that user)
export const getMenuByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user._id;

    const menu = await Menu.findOne({ userId, date });
    if (!menu) {
      return res.status(404).json({ message: "No menu found for this date" });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu", error: error.message });
  }
};

// Get all menus of that user
export const getAllMenus = async (req, res) => {
  try {
    const userId = req.user._id;
    const menus = await Menu.find({ userId }).sort({ date: -1 });

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menus", error: error.message });
  }
};
