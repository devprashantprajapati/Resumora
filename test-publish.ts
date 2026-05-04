import { getAuth, signInAnonymously } from "firebase/auth";
import { auth, db } from "./src/lib/firebase";
import { publishResume, incrementResumeViews } from "./src/lib/resumeService";

async function run() {
  try {
    const cred = await signInAnonymously(auth);
    console.log("Logged in:", cred.user.uid);
  } catch (e) {
    console.error("Auth failed:", e);
    return;
  }
  
  try {
    const defaultData = {
      personalInfo: { fullName: "Test", email: "test@test.com", title: "Test", phone: "", location: "", website: "" },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      interests: [],
      customSections: [],
      settings: {}
    };
    await publishResume("test-slug-foo", defaultData as any);
    console.log("Publish success 1");
    await publishResume("test-slug-foo", defaultData as any);
    console.log("Publish success 2");
    
    await incrementResumeViews("test-slug-foo", "US", "Mozilla");
    console.log("View success");
  } catch (e) {
    console.error("error:", e);
  }
}
run();
