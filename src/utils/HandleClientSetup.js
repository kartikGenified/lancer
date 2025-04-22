//Thanks to Karik for this Setup (The Half Blood Prince)

//clint ID's
export const clientName = "lancer-footwear";
export const clientID = 39;
export const clientOfficialName = "lancer-footwear"
export const baseUrl =  "http://saas-api-dev.genefied.in/"
// "https://saas.genefied.in/"
// "http://saas-api-dev.genefied.in/"
//icons and images d
export const appIcon = require("../../assets/images/lancer_logo.jpg");
export const splash = require("../../assets/gif/Splash-myro.gif");

export const descriptionImages = [
  // require("../../assets/images/Step1.png"),
  require("../../assets/images/step1lancer.png"),
  // require("../../assets/images/Step3.png"),
  // require("../../assets/images/Step4.png"),
  // require("../../assets/images/Step5.png")
];

//Change loaderNew Manually By Simply Replacing images

//Registration
export const RegistrationMessage = `Thank you for joining ${clientOfficialName} Loyalty program`;
export const permissionMessage = `To scan the QR code, the ${clientOfficialName} app must have access permissions. Please grant access to the camera`
export const eKyc = true;  // send true if you want to call aadhar gst and pan api else false


//Dashboard
export const needCaimpaign = __DEV__ ? true : true;

export const scannerType = "qr"; //"qr for qr", "bar for bar

// choose from ["points", "scanned", "redeemed", "cashback","coupon", "warranty", "wheel","previous transaction","wheel","shared"]
export const neededHistory = [
  "points",
  "scanned",
  "redeemed",
  "coupon",
];

export const showEditProfile = true;

export const needWalkedThrough = true

export const needRandomRedeemPoint = true

export const redeemptionItems = ["gift", "cashback","coupon" ]; // choose from -->  ["gift", "cashback","coupon"]
