const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const CLIENT_ID =
  "521092929930-8uc7caqscrr8o888b2sl4jqu51eeebp7.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";

const REFRESH_TOKEN =
  "1//04ZIswzQskUTgCgYIARAAGAQSNwF-L9IrIWc8Q0mQB-BClCrHRGQPVuGcPmYtX1iLMX5-QAs64xD7zdgHTss7ujM_kj7YWzGpeCU";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

// Lấy file từ local
const filePath = path.join(__dirname, "./demo.pdf");
console.log(filePath);
const dataNhoHoTro = {
  id: Math.floor(Math.random() * 10000000),
  student_id: "PH10716",
  name: "Nguyễn Văn A",
  phone_number: "0966414778",
  email: "example@gmail.com",
  address: "Hà Nội",
  major: 12,
  desired_location: "Web intern",
  // 2 là nhờ hỗ trợ (demo)
  status_cv: 2,
};

const dataTuTim = {
  id: Math.floor(Math.random() * 10000000),
  student_id: "PH10716",
  name: "Nguyễn Văn A",
  phone_number: "0966414778",
  email: "example@gmail.com",
  address: "Hà Nội",
  major: 12,
  desired_location: "Web intern",
  company: "FPT POLY",
  internship_address: "Hà Nội",
  tax_code: "0107485244",
  student_reception_title: "Thực tập sinh phát triển web",
  business_contact: "0987654321",
  recipient_email: "hantv@gmail.com",
  // 2 là nhờ hỗ trợ (demo)
  status_cv: 1,
};

// Upload file cv
async function uploadFile(data) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: `CV_${data.student_id}`,
        mimeType: "application/pdf",
      },
      media: {
        mimeType: "application/pdf",
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);
    const idCV = response.data.id;
    const newData = { ...data, idCV };
    // get link public CV
    const dataUrl = await generatePublicUrl(newData);
    return dataUrl;
  } catch (error) {
    console.log(error);
  }
}

// uploadFile(data);

//xoá cv theo idcv
async function deleteCV(id) {
  try {
    const response = await drive.files.delete({
      fileId: `${id}`,
    });
    console.log(response.data, response.status);
  } catch (error) {
    console.log(error);
  }
}

// deleteCV();

async function generatePublicUrl(data) {
  try {
    const fileId = data.idCV;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    const webViewLink = result.data.webViewLink;
    const webContentLink = result.data.webContentLink;
    const newDataUrl = { ...data, webViewLink, webContentLink };
    return newDataUrl;
  } catch (error) {
    console.log(error.message);
  }
}

// generatePublicUrl();

const getUser = async (id) => {
  const data = await axios.get(`http://localhost:3000/users/${id}`);
  return data;
};

const updateCV = async (id) => {
  try {
    const { data } = await getUser(id);
    await deleteCV(data.idCV);
    const newData = await uploadFile(data);
    axios
      .put(`http://localhost:3000/users/${data.id}`, newData)
      .then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
};

// updateCV(1387186);
const createCV = async (data) => {
  try {
    const newData = await uploadFile(data);
    axios
      .post(`http://localhost:3000/users`, newData)
      .then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};
createCV(dataTuTim);
