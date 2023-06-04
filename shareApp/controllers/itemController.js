const Item = require('../models/item.model').model;
const User = require('../models/user.model').model;

const socketController = require('../controllers/socketController.js');

const getItems = async (req, res) => {
   try {
       const items = await Item.find().where("statut").in([false]);
       res.status(200).json(items);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};


const borrowItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const user = await User.findById(req.userId);

    if(user.borrowedItems.length >= 2) {
      res.status(400).json({ error: 'You already borrowed 2 items !' });
      return;
    }
    const updated = await Item.findByIdAndUpdate(itemId, {
      statut: true,
      userId: user
    }, { new: true });

    if(!updated) {
      throw new Error('Item not found !');
    }
    user.borrowedItems.push(updated._id);
    await user.save();
    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const user = await User.findById(req.userId);
    const item = await Item.findById(itemId);

    if(!item.userId) {
      await Item.findByIdAndDelete(itemId);
      res.status(204).send();
      return;
    }

    if(!(item.userId == req.userId)) {
      res.status(403).json({error: 'Cannot delete item you did not add !'});
      return;
    }

    if(item.statut) {
      throw new Error('Cannot be deleted !');
    }
    await Item.findByIdAndDelete(itemId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};


const getOtherItems = async (req, res) => {
  const items = await Item.find().where("statut").in([true]).populate('userId');
  console.log(items);
  const otherItems = items.map(item => {
    return {
      description: item.description,
      userName: item.userId.name
    }
  });
  res.status(200).json(otherItems);
};

const releaseItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const user = await User.findById(req.userId);
    const updated = await Item.findByIdAndUpdate(itemId, {
      statut: false,
      userId: null
    }, { new: true });

    if (!updated) {
      res.status(404).json({ error: 'Item not found !' });
    }

    user.borrowedItems.pull(updated._id);
    await user.save();

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const createItem = async (req, res, _) => {
  const newItemData = { ...req.body };
  console.log("req.userId:",req.userId);
  try {
    newItemData["userId"] = req.userId;
    const item = await Item.create(newItemData);
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json(error);
  }
};


const updateItem = async (req, res) => {
  const { itemId, newDescription } = req.body;
  try {
    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({ message: 'Item not found !' });
      return;
    }
    item.description = newDescription;
    const updated = await item.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json(error);
  }
};


module.exports.getItems = getItems;
module.exports.borrowItem = borrowItem;
module.exports.deleteItem = deleteItem;
module.exports.getOtherItems = getOtherItems;
module.exports.createItem = createItem;
module.exports.releaseItem = releaseItem;
module.exports.updateItem = updateItem;
