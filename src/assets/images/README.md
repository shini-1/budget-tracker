# App Logo

## Logo File
Please save the FoodVenturer logo image as `logo.png` in this directory.

The logo should be:
- PNG format
- Transparent background (if possible)
- Multiple sizes for different use cases:
  - `logo.png` - Original size
  - `logo@2x.png` - 2x resolution
  - `logo@3x.png` - 3x resolution

## Android Icon
For Android launcher icon, also add:
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

## iOS Icon
For iOS, add to `ios/foodventurer/Images.xcassets/AppIcon.appiconset/`

## Usage in Code
```typescript
import Logo from './assets/images/logo.png';

<Image source={Logo} style={{ width: 200, height: 200 }} />
```
