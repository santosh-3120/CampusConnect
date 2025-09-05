// controllers/clubController.js
const Club = require('../models/Club');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.createClub = async (req, res) => {
  try {
    const { name, description, socialLinks } = req.body;
    if (!name) return res.status(400).json({ message: 'Club name is required' });

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path;
    }

    const club = new Club({
      name: name.trim(),
      description: description ? description.trim() : '',
      logo: imageUrl,
      coordinator: req.user._id,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
    });

    await club.save();
    res.status(201).json(club);
  } catch (err) {
    console.error('Error in createClub:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate('coordinator', 'name');
    const clubsWithFollowing = clubs.map(club => ({
      ...club.toJSON(),
      isFollowing: req.user && club.followers.some(followerId => followerId.toString() === req.user._id.toString()),
    }));
    res.json(clubsWithFollowing);
  } catch (err) {
    console.error('Error in getClubs:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

exports.getClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('coordinator', 'name');
    if (!club) return res.status(404).json({ message: 'Club not found' });
    const clubWithFollowing = {
      ...club.toJSON(),
      isFollowing: req.user && club.followers.some(followerId => followerId.toString() === req.user._id.toString()),
    };
    res.json(clubWithFollowing);
  } catch (err) {
    console.error('Error in getClub:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

exports.updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const { name, description, socialLinks } = req.body;
    if (name) club.name = name.trim();
    if (description) club.description = description.trim();
    if (socialLinks) {
      try {
        club.socialLinks = JSON.parse(socialLinks);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid socialLinks format' });
      }
    }
    if (req.file) {
      club.logo = req.file.path;
    }

    await club.save();
    res.json(club);
  } catch (err) {
    console.error('Error in updateClub:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json({ message: 'Club deleted' });
  } catch (err) {
    console.error('Error in deleteClub:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

exports.followClub = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can follow clubs' });
    }

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    if (!club.followers.includes(req.user._id)) {
      club.followers.push(req.user._id);
      await club.save();
    }
    res.json({ message: 'Club followed' });
  } catch (err) {
    console.error('Error in followClub:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

exports.unfollowClub = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can unfollow clubs' });
    }

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    club.followers = club.followers.filter(id => id.toString() !== req.user._id.toString());
    await club.save();
    res.json({ message: 'Club unfollowed' });
  } catch (err) {
    console.error('Error in unfollowClub:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

exports.getClubMessages = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('messages.author', 'name');
    if (!club) return res.status(404).json({ message: 'Club not found' });

    if (req.user.role !== 'admin' && !club.followers.includes(req.user._id)) {
      return res.status(403).json({ message: 'You must follow the club to view messages' });
    }

    res.json(club.messages);
  } catch (err) {
    console.error('Error in getClubMessages:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

exports.postClubMessage = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can post messages' });
    }

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Message content is required' });

    club.messages.push({ content: content.trim(), author: req.user._id });
    await club.save();
    res.status(201).json(club.messages[club.messages.length - 1]);
  } catch (err) {
    console.error('Error in postClubMessage:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

exports.deleteClubMessage = async (req, res) => {
  const { clubId, messageId } = req.params;

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    const messageExists = club.messages.some((msg) => msg._id.toString() === messageId);
    if (!messageExists) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (req.user.role !== 'admin' && club.coordinator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Club.findByIdAndUpdate(clubId, {
      $pull: { messages: { _id: messageId } },
    });

    res.status(200).json({ message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getClubFollowers = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('followers', 'name _id');
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const followers = club.followers.map(user => ({
      id: user._id,
      name: user.name,
    }));

    res.json(followers);
  } catch (err) {
    console.error('Error in getClubFollowers:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

exports.removeClubFollower = async (req, res) => {
  const { clubId, userId } = req.params;

  try {
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const isFollower = club.followers.some(follower => follower.toString() === userId);
    if (!isFollower) return res.status(400).json({ message: 'User is not a follower of this club' });

    club.followers = club.followers.filter(follower => follower.toString() !== userId);
    await club.save();

    res.json({ message: 'Follower removed successfully' });
  } catch (err) {
    console.error('Error in removeClubFollower:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};