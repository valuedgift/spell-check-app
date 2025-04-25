import { useEffect, useState } from "react";
import { FiDownload, FiCopy, FiFileText, FiX } from "react-icons/fi";
import { SiDropbox, SiGoogledrive } from "react-icons/si";
import { Dropbox } from "dropbox";
import { gapi } from "gapi-script";
import "./App.css";

const CLIENT_ID = "119680918052-3heq7nfmk7ba1e2amko01b601ac4g9ng.apps.googleusercontent.com";
const API_KEY = "AIzaSyCf5wD8PVs9aL72mTvtHxxrJcqvYrq6aVY";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

function App() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [done, setDone] = useState(false);
  const [language, setLanguage] = useState("English");
  const [mode, setMode] = useState("Word Changer");
  const [spellingMistakes, setSpellingMistakes] = useState(null);
  const [mistakes, setMistakes] = useState([]);
  const [readingTime, setReadingTime] = useState(null);
  const [grammarResult, setGrammarResult] = useState(null);

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setText(text);
      setPasted(true);
      setTimeout(() => setProcessed(true), 500);
      setTimeout(() => setDone(true), 1000);
    } catch (err) {
      alert("Failed to paste text from clipboard");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setText(event.target.result);
      reader.readAsText(file);
    }
  };

  const handleDropboxUpload = async () => {
    const dbx = new Dropbox({ accessToken: "sl.u.AFpIVIofEk44Hn2YgHvnrmw20_qDP0DTR5SWy3LgAxnWVrMYoxA0dREmBzKeO1W6LSS332SLhvfHbqSfTkNJCcYro3UHsdrH5CqkjcScdD9n4yqqhhEURJWLLKh75IqmwkZq3vJUSFuFWY77dm-WT5fnVwdumZePVOUbE5hg6mSvNqoC3D3De12zjCT68Med4yC9Tog6OjUm6wAFGhJUq2BErqbA1cKNmRs2OzOFpTFus_hnhkNsYA-JsgS3cQbCtsoHBjr8f4nanR92Fw8FMn2mmZ9cwRKbs1FXD18vQkPqaX6T9A4S7DdtO4Ms2U1IAOYV3VObctuycZ35TCs462g3-uIp2yHd3nx6IFkTCiOs8KxK_7Xk1JcZm8Cm6Bnx5TUWjvBl28RQ7LdMW97VJr0oxvG34ZG5blrb3EjQvmfIxijKkQ6BGj4DH5lKvCG2GHmYYeL_K_gWfGPBt1EDCNEvDDJLMV9EHzdwo6oOrZDtGuvvmuQ9uGP9vjWUttVgOQDc-HGYAcNQnQnvdEqhizp9Nurj_UORilLUHIIN3vsRSFjRZBOUnAMuGlC06cCfrVnpKuxeQBTgizkAEWwv9HGNik5m5HVkpooAmkC5VnSYoMtH2yJLamfFx-lh-6YdnlBbd0dGvh3UuyLgfhS0HZo5klguYDeYbfmK9dZ-kdD7ngl9y5h3_niKxJZv-agW3MKA5n7X_uejbzOJyfIXuQkQdPbYP_xM-izeYKjBQ-HKGFuKzz5SC647KUxhBRqerieiliJ_xMBPT7SM0qDR9bA05FtJlgViiMW_2VcKHA_r135-rqwk2A4FUAeFKlwD5xA5SvQogQkG37nIN26AzZoGOaxou26ZS2y2msvB_Q3r_vqK1SqDOGFBNz9fw-9yLAvazW-xqTUWoRKHe11Vmpdslzmed2B46Ml-mscLPKExNG8j5fOZzDK55q1oLW7AQkCuu1in9ow3Z3d6SoUVr6KNwug-Ux4EsOOyP1CRi6fbFNEJw1QWHqM5m2xwOlAeiuYk7Zhk2uTRvYqEHo4zm9adw1xCU-gcCnFH4D6jaVKvP3hKwklC9Q4zSnSc0oVNrdpoIoJkuHS58EoxNrYtTMXaMZDaVv00HkKDAz-0f5oCC06MvO4FAZb0kN7R4iOWWOyx9aSDhyOaC5E1J8yoTfJF6gGe0d7sjMWM65lOOlWFniOhGVniQUbEjdqgXl2woqmQjrTkEjpvJETSojUjdxq1SSQObU1qKNtgrvXQnNttmhCdBxMJfRbo7226y4G-zKWHhCCt8Os-52VnKk2PmMg9tAWOEG7Tyniaa2Tp9_w_hTrbTvzze1Gt2IPT5e4XV6CH-WbltnOvSyNKev_Do71tVGxgcZxl6JNhhX6tUeWrzVwjyWhnG6_cftoFq6qzpr5lkJXUtO3lV3-wQr1mLWsoHbgsevWHlkep46yuHatZyA" });
    const fileContent = new Blob([text], { type: "text/plain" });

    try {
      await dbx.filesUpload({
        path: `/spell-checker-${Date.now()}.txt`,
        contents: fileContent,
      });
      alert("Uploaded to Dropbox successfully!");
    } catch (error) {
      console.error(error);
      alert("Dropbox upload failed");
    }
  }

  const handleGoogleDriveUpload = async () => {
    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
  
    if (!isSignedIn) {
      await gapi.auth2.getAuthInstance().signIn();
    }
  
    const accessToken = gapi.auth.getToken()?.access_token;
  
    if (!accessToken) {
      alert("Failed to get access token. Try signing in again.");
      return;
    }
  
    const file = new Blob([text], { type: "text/plain" });
    const metadata = {
      name: `spell-checker-${Date.now()}.txt`,
      mimeType: "text/plain",
    };
  
    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);
  
    try {
      await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: new Headers({ Authorization: "Bearer " + accessToken }),
        body: form,
      });
      alert("Uploaded to Google Drive!");
    } catch (err) {
      console.error(err);
      alert("Google Drive upload failed");
    }
  };

  const handleClear = () => {
    setText("");
    setSpellingMistakes(null);
    setMistakes([]);
    setReadingTime(null);
    setGrammarResult(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "text.txt";
    document.body.appendChild(element);
    element.click();
  };

  const checkSpelling = async () => {
    const words = text.trim().split(/\s+/);
    const foundMistakes = [];

    for (const word of words) {
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
        if (!res.ok) foundMistakes.push(word);
      } catch {
        foundMistakes.push(word);
      }
    }

    setSpellingMistakes(foundMistakes.length);
    setMistakes(foundMistakes);
    setReadingTime((words.length / 200).toFixed(2));
  };

  const checkGrammar = async () => {
    try {
      const response = await fetch("https://api.languagetoolplus.com/v2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text,
          language: language.toLowerCase(),
        }),
      });

      const result = await response.json();
      setGrammarResult(result.matches);
    } catch (err) {
      console.error("Grammar check failed", err);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app">
        <h1>Spell Checker</h1>
        <div className="icon-row">
          <FiFileText className={`icon ${pasted ? "green" : ""}`} onClick={handlePaste} />
          <hr />
          <span className={`processing-dot ${processed ? "green" : ""}`}>●</span>
          <hr />
          <span className={`done-check ${done ? "green" : ""}`}>✓</span>
        </div>

        <div className="textarea-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
          ></textarea>

          <div className="left-icons">
            <label htmlFor="file-upload" className="icon" title="Upload from computer">
              <FiFileText />
            </label>
            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <SiDropbox className="icon" onClick={handleDropboxUpload} title="Dropbox" />
            <SiGoogledrive className="icon" onClick={handleGoogleDriveUpload} title="Google Drive" />
          </div>

          <div className="right-icons">
            <FiX className="icon" onClick={handleClear} title="Clear" />
            <FiCopy className="icon" onClick={handleCopy} title="Copy" />
            <FiDownload className="icon" onClick={handleDownload} title="Download" />
          </div>
        </div>

        <div className="options">
          <div>
            <label>Language:</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Italian</option>
            </select>
          </div>
          <div>
            <label>Mode:</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option>Word Changer</option>
              <option>Smart Spin</option>
            </select>
          </div>
        </div>

        <div className="limits">
          <p>Limit: 200 words</p>
          <p>Words: {text.trim().split(/\s+/).filter(Boolean).length}</p>
        </div>

        <div className="check-buttons">
          <button onClick={checkSpelling}>Check Spelling</button>
          <button onClick={checkGrammar}>Check Grammar</button>
        </div>

        {spellingMistakes !== null && (
          <div className="results">
            <p>Spelling Mistakes: {spellingMistakes}</p>
            <p>Reading Time: {readingTime} mins</p>
            {mistakes.length > 0 && <ul>{mistakes.map((m, i) => <li key={i}>{m}</li>)}</ul>}
          </div>
        )}

        {grammarResult && grammarResult.length > 0 && (
          <div className="results">
            <p>Grammar Issues Found: {grammarResult.length}</p>
            <ul>
              {grammarResult.map((issue, idx) => (
                <li key={idx}>{issue.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;