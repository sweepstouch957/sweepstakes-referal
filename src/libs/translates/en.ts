const en = {
  translation: {
    common: {
      welcome: "Welcome",
      submit: "Submit",
      cancel: "Cancel",
      yes: "Yes",
      no: "No",
      next: "Next",
      prev: "Previous",
    },
    referralStep: {
      step1: "Your Information",
      step2: "Referral Code",
      step3: "Verify Code",
      title: "Win a 2025 Nissan Versa!",
      proccesing: "Processing your registration...",
    },
    winATv: {
      title: "Win a 55'' TV December 25",
      notConfigured: "This giveaway isn't configured yet. Please check back soon.",
    },
    login: {
      title: "Login with your phone",
      phoneLabel: "Phone number",
      sendOtp: "Send OTP",
      enterOtp: "Enter the OTP sent to",
      verifyOtp: "Verify OTP",
      changePhone: "Change number",
      errorInvalidPhone: "Phone number not registered",
      errorInvalidOtp: "Invalid OTP",
      loading: "Loading...",
    },
    form: {
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      email: "Email",
      zip: "ZIP Code",
      referralCode: "Referral Code (Optional)",
      supermarket: "Supermarket",
      errors: {
        firstName: {
          required: "First name is required",
          max: "First name must be less than 50 characters",
        },
        lastName: {
          required: "Last name is required",
          max: "Last name must be less than 50 characters",
        },
        phone: "Phone number must be in format (123) 456-7890",
        email: "Enter a valid email address",
        zip: "ZIP code must be 5 digits",
        otp: "OTP must be exactly 6 digits",
      },
    },
    profile: {
      title: "Your Profile",
      coupons: "Your Entries",
      referralLink: "Your Referral Link",
      referralCode: "Your Referral Code",
      copyLink: "Copy Link",
      copyCode: "Copy Code",
      registeredFriends: "Friends registered with your link",
      noReferrals:
        "You don't have any referrals yet. Share your link to get more chances!",
      selectStore: "Select store",
      shareWhatsapp: "Share on WhatsApp",
      shareFacebook: "Share on Facebook",
      share: "Share",
      mainReferralLink: "Referral Link",
      copySuccess: "Link copied!",
      codeCopySuccess: "Code copied to clipboard",
      inviteMore: "Keep sharing and good luck in the giveaway!",
    },
    referral: {
      shareTitle: "Invite, Share, and Win!",
      shareDescription: "Share your exclusive link and boost your chances.",
      copy: "Copy the link and send it via WhatsApp, Messenger, Facebook, SMS, or anywhere!",
      referralExtra:
        "Each friend who registers with your code gives you an extra entry. Good luck!",
      errorInvalid: "The referral code provided is invalid.",
      autoReferenceError:
        "You cannot use your own referral code to gain extra entries.",
    },
    errors: {
      generic: "An error occurred. Please try again.",
      login: "Login error",
      required: "Required field",
      notFound: "No data found",
      loading: "Loading...",
      duplicate:
        "This number has already participated in the last 24 hours. Try again later.",
      notRegistered: "Phone number not registered",
      referralDuplicate:
        "This number was already registered as a referral in this campaign.",
      otp: {
        invalid: "Invalid or unverified OTP",
        expired: "OTP has expired",
        resend: "You can try again in",
        resending: "Resending...",
        sent: "OTP sent",
      },
    },
    thankyou: {
      title: "Good Luck!",
      description:
        "Increase your chances of winning by sharing with friends and family.",
      main: "I'm participating to WIN a 2025 Nissan Versa at {{storeName}}! 🚗\n\nJoin the giveaway using this link! Each friend who registers gives us another chance to win. 👀👇\n{{referralLink}}",
      registrationCode: "Your entry number is:",
      copySuccess: "Link copied!",
      shareMore:
        "Copy the link and send it via WhatsApp, Facebook, or wherever you want!",
      shareWhatsapp: "Share on WhatsApp",
      shareFacebook: "Share on Facebook",
      shareX: "Share on X (Twitter)",
      shareGmail: "Share via Gmail",
      copyLink: "Copy Link",
      copyright: "All rights reserved.",
    },
    navbar: {
      participate: "Participate",
      login: "Login",
      logout: "Logout",
    },
    otp: {
      title: "Verify your identity",
      instruction: "Enter the 6-digit code sent to",
      fallbackPhone: "your number",
      verified: "Code verified!",
      locked: "Too many attempts. Try again later.",
      attemptsLeft: "{{count}} attempts left",
      resendIn: "You can try again in",
      resendsLeft: "({{count}} left)",
      resending: "Sending...",
      resend: "Resend code",
      notReceived:
        "Didn't receive the code? Check your number and your spam folder.",
    },
  },
};

export default en;
