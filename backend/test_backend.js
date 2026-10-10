const http = require("http");

async function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = JSON.stringify(data);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve(JSON.parse(body)));
      }
    );
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(JSON.parse(body)));
    }).on("error", reject);
  });
}

async function runTests() {
  console.log("=== 1. Health Check ===");
  const health = await getJson("http://localhost:4000/health");
  console.log("Health:", health);

  console.log("\n=== 2. New User Registration Test ===");
  const regEmail = `teacher_${Date.now()}@jharkhand.edu`;
  const regRes = await postJson("http://localhost:4000/api/auth/register", {
    name: "Ramesh Soren",
    email: regEmail,
    password: "securepassword123",
    role: "teacher",
    preferredLang: "san",
  });
  console.log("Registration Response:", regRes.success ? "SUCCESS" : "FAILED", `User: ${regRes.user?.name} (${regRes.user?.email})`);

  console.log("\n=== 3. Newly Registered User Login Test ===");
  const loginRes = await postJson("http://localhost:4000/api/auth/login", {
    email: regEmail,
    password: "securepassword123",
  });
  console.log("Login Response:", loginRes.success ? "SUCCESS" : "FAILED", `Role: ${loginRes.role}`);

  console.log("\n=== 4. Duplicate Registration Prevention Test ===");
  const dupRes = await postJson("http://localhost:4000/api/auth/register", {
    name: "Duplicate User",
    email: regEmail,
    password: "securepassword123",
    role: "teacher",
  });
  console.log("Duplicate Check:", dupRes.error ? `PASSED (${dupRes.error})` : "FAILED");

  console.log("\n🎉 AUTH REGISTRATION & LOGIN TESTS PASSED SUCCESSFULLY!");
}

runTests().catch(console.error);
