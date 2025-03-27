import DonationItem from '../models/DonationItem.js';
import cloudinary from 'cloudinary';

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get donation details by ID
export const getDonationDetails = async (req, res) => {
  const { donationId } = req.params;  // Extract donationId from the URL params

  try {
    // Fetch the donation item by donationId
    const donation = await DonationItem.findById(donationId)
      .populate('donorId', 'name email')  // Populating donor info
      .populate('bookedBy', 'name location');  // Populating orphanage info (if booked)

    if (!donation) {
      return res.status(404).json({ message: 'Donation item not found' });
    }

    res.status(200).json(donation);  // Return the donation details
  } catch (error) {
    console.error('Error fetching donation item:', error);
    res.status(500).json({ message: 'Error fetching donation item', error });
  }
};


// Delete a donation item along with its associated images on Cloudinary
export const deleteDonationItem = async (req, res) => {
  const { donationId } = req.params;

  try {
    // Find the donation item in the database
    const donation = await DonationItem.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: "Donation item not found" });
    }

    // Delete associated images from Cloudinary
    if (donation.imageUrls && donation.imageUrls.length > 0) {
      console.log("🗑️ Deleting images from Cloudinary:", donation.imageUrls);

      for (const imageUrl of donation.imageUrls) {
        try {
          // Extract the filename with folder (Cloudinary stores files as 'donation-system/filename')
          const urlParts = imageUrl.split('/');
          const fileName = urlParts.pop(); // Get last part (e.g., "sample.jpg")
          const folderName = urlParts[urlParts.length - 1] === "donation-system" ? "donation-system" : ""; // Ensure folder
          const publicId = folderName ? `${folderName}/${fileName.split('.')[0]}` : fileName.split('.')[0]; // Remove extension

          // Delete from Cloudinary
          await cloudinary.v2.uploader.destroy(publicId, { resource_type: 'image' });

          console.log(`✅ Cloudinary image deleted: ${publicId}`);
        } catch (cloudError) {
          console.error(`❌ Error deleting Cloudinary image (${imageUrl}):`, cloudError);
        }
      }
    }

    // Delete the donation item from the database
    await DonationItem.findByIdAndDelete(donationId);

    res.status(200).json({ message: "Donation item and associated images deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting donation item:", error);
    res.status(500).json({ message: "Error deleting donation item", error });
  }
};