# PhishiAvoid

PhishiAvoid is a lightweight and effective extension for Gmail that helps you avoid phishing attacks by identifying trusted senders and blocking suspicious contacts.

---

## 🚀 Quick Install (Just to use)

You can install **PhishiAvoid** directly from the Chrome Web Store:  
👉 [**Click here to install**](https://chromewebstore.google.com/detail/phishiavoid/anmniialomnomcmibngpplkjcffkalip?utm_source=ext_app_menu)

Or simply search for **"PhishiAvoid"** in the Chrome Web Store.

---

## 🔧 Local Development

To develop and test the PhishiAvoid extension locally, follow the steps below:

### Prerequisites

Before starting, make sure you have installed on your machine:

- Node.js (recommended version 16.x LTS)  
- npm (usually comes bundled with Node.js)  
- React (already listed as a project dependency and will be installed via npm)  

> **Tip:** We recommend using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to install and manage multiple Node.js versions on your system. To install Node.js 16, for example, run:

````bash
nvm install 16
nvm use 16
````

### Steps to run in development mode

1. Clone this repository:

    ```bash
    git clone https://github.com/gabrielborgesc/pishiavoid.git
    cd pishiavoid
    ```

2. Install the project dependencies:

    ```bash
    npm install
    ```

3. Start Webpack in watch mode to automatically compile changes:

    ```bash
    npm run watch
    ```

    This will make Webpack watch for code changes and output the compiled files to the `dist` folder.

4. Open Google Chrome and go to the extensions page:

    ```
    chrome://extensions/
    ```

5. Enable **Developer Mode** (toggle in the top right corner).

6. Click **Load unpacked** and select the `dist` folder inside your project.

---

### Important note

Whenever you make changes to the source code, Webpack will automatically recompile. To see the updates in Chrome, return to the `chrome://extensions/` page and click the **Refresh** button (refresh icon) on the loaded extension.



---

## 💡 Key Features

- Automatically detects the sender’s email when opening messages in Gmail.
- Analyzes and lists all links present in the email body for your full control.
- Allows you to save contacts as “Trusted” or “Blocked” to customize your security.
- Alerts you about senders with similar email addresses that may be impersonating legitimate contacts.
- Simple and discreet interface, providing quick and easy access right inside Gmail.

---

## 🛡 Why use PhishiAvoid?

Phishing is one of the most common cyber attacks aimed at stealing your credentials and personal data. With PhishiAvoid, you get an extra layer of protection directly in your browser, increasing your confidence when opening emails and clicking links.

---

## ⚙️ How does it work?

The extension monitors the open email in Gmail, extracts the sender and links, and offers tools to easily manage your contacts. We use intelligent algorithms to detect possible identity spoofing attempts via similar email addresses.

PhishiAvoid was built using **React** and **Webpack**, allowing for a modular, high-performance and modern development stack.

---

## ✅ Install now and browse your email more safely!
