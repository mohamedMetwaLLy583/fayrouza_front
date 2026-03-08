const axios = require("axios");

const verifyOtp = async () => {
  try {
    const email = "test_user_saudi_137@yopmail.com";
    const otp = "8385";
    console.log("--- Verifying OTP for:", email);
    const response = await axios.post(
      "https://fayrouza.sdevelopment.tech/api/verify-otp",
      {
        email: email,
        otp: otp,
      },
    );
    console.log("--- Success:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("--- Error:");
    console.error(
      JSON.stringify(error.response?.data || error.message, null, 2),
    );
  }
};

verifyOtp();
