# FAQ Header Background Image Setup

## 📁 **File Destination Created**

Your background image should be placed in:
```
public/images/faq-header-bg.jpg
```

## 🚀 **How to Add Your Image**

### **Option 1: Direct File Placement**
1. **Copy your image file** to the `public/images/` folder
2. **Rename it** to `faq-header-bg.jpg` (or update the code below)
3. **Restart your dev server** if needed

### **Option 2: Use Your Own Filename**
If you want to use a different filename, update this line in `src/pages/Faq.jsx`:

```javascript
// Change this line (around line 267):
backgroundImage: `url('/images/faq-header-bg.jpg')`,

// To your filename:
backgroundImage: `url('/images/your-image-name.jpg')`,
```

## 📋 **Supported Image Formats**

- **JPG/JPEG**: Best for photos and complex images
- **PNG**: Good for images with transparency
- **WebP**: Modern format with better compression
- **SVG**: Vector format for scalable graphics

## 🎯 **Recommended Image Specifications**

- **Dimensions**: 1920x1080px or larger (will scale down automatically)
- **Aspect Ratio**: 16:9 or wider for best header coverage
- **File Size**: Under 2MB for optimal loading
- **Content**: Abstract patterns, gradients, or subtle textures work best

## 🔧 **Customization Options**

### **Change Background Position**
```javascript
backgroundPosition: 'center', // Options: 'top', 'center', 'bottom', 'left', 'right'
```

### **Adjust Overlay Opacity**
```javascript
// In the overlay div (around line 278):
<div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

// Change /20 to adjust opacity (0 = transparent, 100 = fully opaque)
<div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
```

### **Modify Text Colors**
```javascript
// Main heading (around line 285):
className="... bg-gradient-to-r from-white via-blue-100 to-cyan-100 ..."

// Subtitle (around line 292):
className="... text-white ..."
```

## 📱 **Responsive Behavior**

The background image automatically:
- ✅ Scales to cover the entire header area
- ✅ Maintains aspect ratio on all devices
- ✅ Centers content for optimal viewing
- ✅ Works on mobile, tablet, and desktop

## 🚨 **Troubleshooting**

### **Image Not Showing?**
1. Check file path: `public/images/faq-header-bg.jpg`
2. Verify file exists in the correct location
3. Restart your development server
4. Check browser console for errors

### **Image Too Large?**
- The `backgroundSize: 'cover'` ensures optimal scaling
- Image will automatically crop to fit the header area

### **Text Hard to Read?**
- Adjust overlay opacity: change `bg-black/20` to `bg-black/40` or higher
- Modify text shadows in the style attributes

## 🎨 **Design Tips**

- **Light Images**: Use darker overlay (`bg-black/40` or higher)
- **Dark Images**: Use lighter overlay (`bg-black/10` or lower)
- **Busy Images**: Increase overlay opacity for better text readability
- **Simple Images**: Lower overlay opacity to show more of the image

Your header is now ready for a beautiful background image! 🎉
