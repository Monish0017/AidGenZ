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


// Delete a donation item along with its associated file on Cloudinary
export const deleteDonationItem = async (req, res) => {
  const { donationId } = req.params;

  try {
    // Find the donation item
    const donation = await DonationItem.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: "Donation item not found" });
    }

    // Delete the associated file from Cloudinary (if it exists)
    if (donation.imageUrls) { // Assuming fileUrl stores the Cloudinary URL
      console.log("🗑️ Deleting file from Cloudinary:", donation.imageUrls);

      // Extract public ID from Cloudinary URL
      const parts = donation.fileUrl.split('/');
      const fileName = parts.pop(); // Get the last part
      const publicId = fileName.split('.')[0]; // Remove extension (e.g., "file.pdf" -> "file")

      // Determine resource type (image or raw)
      const isImage = donation.fileUrl.includes('/image/upload/');
      const resourceType = isImage ? 'image' : 'raw';

      // Delete from Cloudinary
      await cloudinary.v2.uploader.destroy(publicId, { resource_type: resourceType });

      console.log("✅ Cloudinary file deleted successfully.");
    }

    // Delete the donation item from the database
    await DonationItem.findByIdAndDelete(donationId);

    res.status(200).json({ message: "Donation item and associated file deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting donation item:", error);
    res.status(500).json({ message: "Error deleting donation item", error });
  }
};

