// packages installed 

require("dotenv").config();
const axios = require('axios')
const nodemailer = require("nodemailer");
const util = require("util")
const key = require("./keys")

function sendMail() {
  const user = process.env.EMAIL
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });


  const sendMail = util.promisify(transporter.sendMail.bind(transporter))

  
  const contacts = [
    {
      email: "4044289111@tmomail.net",
      location: {
        city: 'Marietta',
        state: 'GA',
        country: 'US',
        zip_Code:"30067",
        timezone: 'America/New_York'
      }
    },
    // {
    //   email: "6784487449@tmomail.net",
    //   location: {
    //     city: 'Marietta',
    //     state: 'GA',
    //     country: 'US',
    //     timezone: 'America/New_York'
    //   }
    // },
    // {
    //   email: "7702651345@vtext.com",
    //   location: {
    //     city: 'Marietta',
    //     state: 'GA',
    //     country: 'US',
    //     timezone: 'America/New_York'
    //   }
    // },
    // {
    //   email: "4048456167@tmomail.net",
    //   location: {
    //     city: 'Marietta',
    //     state: 'GA',
    //     country: 'US',
    //     timezone: 'America/New_York'
    //   }
    // },

    // {
    //   email: "7707447184@mms.cricketwireless.net",
    //   location: {
    //     city: 'Marietta',
    //     state: 'GA',
    //     country: 'US',
    //     timezone: 'America/New_York'
    //   }
    // },
    // {
    //   email: "4046421818@tmomail.net",
    //   location: {
    //     city: 'Marietta',
    //     state: 'GA',
    //     country: 'US',
    //     timezone: 'America/New_York'
    //   }
    // },

    // {
    //   email: "5128250737@tmomail.net",
    //   location: {
    //     city: 'Austin',
    //     state: 'TX',
    //     country: 'US',
    //     timezone: 'America/Chicago'
    //   }
    // },
    // {
    //   email: "7703293079@tmomail.net",
    //   location: {
    //     city: 'Marietta',
    //     state: 'GA',
    //     country: 'US',
    //     timezone: 'America/New_York'
    //   }
    // }
  ]

  function timeConverter(unix_timestamp, timezone) {
    var date = new Date(unix_timestamp * 1000);

    return date.toLocaleTimeString('en-US', {
      timezone
    })
  }

  async function sendWeatherMail() {
    for (let contact of contacts) {
      const {
        city,
        state,
        country,
        zip_Code,
        timezone
      } = contact.location
      const api_call = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country},${zip_Code}&appid=${process.env.ACCESS_KEY}&units=imperial`);
      console.log(api_call.data);
      const {
        main,
        weather,
        sys,
        wind
      } = api_call.data

      let mailOptions = {
        from: process.env.EMAIL,
        to: contact.email,
        subject: `Weather data for ${city}, ${state}`,
        text: `
        Description: ${weather[0].description}
        Temperature: ${main.temp}° F
        LO/Hi: ${main.temp_min}°/${main.temp_max}° F
        Humidity: ${main.humidity}%
        Wind: ${wind.speed}m/h
        Sunrise: ${timeConverter(sys.sunrise, timezone)}
        Sunset: ${timeConverter(sys.sunset, timezone)}
      `
      };
      console.log(mailOptions.text)

      const info = await sendMail(mailOptions)
      console.log(info)
    }
  }

  sendWeatherMail().then(process.exit.bind(process, 0)).catch((err) => {
    console.error(err)
    process.exit(1)
  })

}

exports.sendMail = function () {
  return sendMail()
};