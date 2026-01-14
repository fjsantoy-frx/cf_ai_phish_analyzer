# 🛡️ Phish-Scale: Cloudflare AI Phishing Analyzer

![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
![Llama 3.3](https://img.shields.io/badge/Llama_3.3-04adff?style=for-the-badge&logo=Meta&logoColor=white)
![Cybersecurity](https://img.shields.io/badge/Focus-Cybersecurity-red?style=for-the-badge)

**Phish-Scale** is an AI-powered security application built on the Cloudflare Edge. It is designed to protect college students and student-athletes from social engineering, NIL scams, and credential harvesting.

---

## 📖 Project Concept
As a senior Cybersecurity major and collegiate athlete, I recognized a gap in how phishing threats are communicated to students. **Phish-Scale** bridges this gap by using LLMs to provide instant "film study" on suspicious emails.

### The "Scout" Analysis Pillars:
* **Urgency Scoring:** Detects high-pressure tactics used in scholarship/eligibility scams.
* **NIL Fraud Detection:** Identifies fake brand deal inquiries that request sensitive financial info.
* **Credential Harvesting:** Spots spoofed university login portals.

---

## 🏗️ Architecture



The app runs entirely serverless for maximum speed and security:
1. **Frontend:** Cloudflare Pages (HTML5/Tailwind CSS).
2. **Backend:** Cloudflare Workers (JavaScript).
3. **AI Engine:** Workers AI running `llama-3.3-70b-instruct-awq`.
4. **Database:** Workers KV for logging threat trends.

---

## 💻 Implementation

### 1. The Worker (Logic)
The core logic resides in `src/index.js`. It intercepts the request and pipes it to the AI model.

```javascript
// Example of the AI inference call
const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-awq', {
  messages: [
    { 
      role: 'system', 
      content: 'You are a cybersecurity coach. Analyze the text for phishing.' 
    },
    { role: 'user', content: userInput }
  ],
});
