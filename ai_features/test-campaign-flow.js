const http = require('http');

const runTest = async () => {
  const fetch = (url, options = {}) => {
    return new Promise((resolve, reject) => {
      const req = http.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
      });
      req.on('error', reject);
      if (options.body) req.write(options.body);
      req.end();
    });
  };

  try {
    // 1. Get templates
    console.log("Fetching templates...");
    const tplRes = await fetch('http://localhost:3000/api/v1/templates');
    const templateId = tplRes.data.templates[0].id;
    console.log("Got template ID:", templateId);

    // 2. Create campaign
    console.log("Creating campaign...");
    const createRes = await fetch('http://localhost:3000/api/v1/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Test API Campaign",
        subject: "Hello from Test",
        description: "Test run",
        templateId: templateId,
        fromName: "Test User",
        fromEmail: "test@knowith.com"
      })
    });
    console.log("Create Campaign Response:", createRes.data);
    const campaignId = createRes.data.campaign.id;

    // 3. Add Recipients
    console.log("Adding recipients...");
    // Let's create a lead first if none exists
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const lead = await prisma.lead.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        status: "NEW",
        leadSource: "Manual",
      }
    });

    const addRecRes = await fetch(`http://localhost:3000/api/v1/campaigns/${campaignId}/recipients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadIds: [lead.id]
      })
    });
    console.log("Add Recipients Response:", addRecRes.data);

    // 4. Send Campaign
    console.log("Sending campaign...");
    const sendRes = await fetch(`http://localhost:3000/api/v1/campaigns/${campaignId}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    console.log("Send Campaign Response:", sendRes.data);

  } catch (err) {
    console.error(err);
  }
};

runTest();
