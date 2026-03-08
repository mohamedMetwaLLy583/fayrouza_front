const axios = require("axios");

const register = async () => {
  try {
    const email =
      "test_user_saudi_" + Math.floor(Math.random() * 1000) + "@yopmail.com";
    console.log("--- Registering with email:", email);
    const response = await axios.post(
      "https://fayrouza.sdevelopment.tech/api/register",
      {
        name: "Saudi User Test",
        email: email,
        password: "password123",
        password_confirmation: "password123",
        phone: "5" + Math.floor(Math.random() * 100000000),
        dial_code: "+966",
        country_id: 1,
        city_id: 1,
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

register();
