import { db, auth } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc, serverTimestamp, Timestamp, onSnapshot } from 'firebase/firestore';
import { ResumeData } from '@/types/resume';

export interface SavedResume {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  data: ResumeData;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: any[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const saveResume = async (resumeId: string, title: string, data: ResumeData): Promise<void> => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const path = `resumes/${resumeId}`;
  try {
    const resumeRef = doc(db, 'resumes', resumeId);
    const docSnap = await getDoc(resumeRef);
    
    const payload = {
      userId: auth.currentUser.uid,
      title: title || 'Untitled Resume',
      updatedAt: serverTimestamp(),
      data: JSON.stringify(data)
    };

    if (!docSnap.exists()) {
      // Create new
      await setDoc(resumeRef, {
        ...payload,
        createdAt: serverTimestamp()
      });
    } else {
      // Update existing
      await setDoc(resumeRef, payload, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserResumes = async (): Promise<SavedResume[]> => {
  if (!auth.currentUser) return [];
  
  const path = 'resumes';
  try {
    const q = query(collection(db, 'resumes'), where('userId', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
        data: JSON.parse(data.data) as ResumeData
      };
    }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getResume = async (resumeId: string): Promise<SavedResume | null> => {
  if (!auth.currentUser) return null;
  
  const path = `resumes/${resumeId}`;
  try {
    const docRef = doc(db, 'resumes', resumeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        title: data.title,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
        data: JSON.parse(data.data) as ResumeData
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const renameResume = async (resumeId: string, newTitle: string): Promise<void> => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const path = `resumes/${resumeId}`;
  try {
    const resumeRef = doc(db, 'resumes', resumeId);
    await setDoc(resumeRef, {
      title: newTitle,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteResume = async (resumeId: string): Promise<void> => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const path = `resumes/${resumeId}`;
  try {
    await deleteDoc(doc(db, 'resumes', resumeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export interface PublishedResume {
  slug: string;
  userId: string;
  data: ResumeData;
  publishedAt: Date;
  views: number;
}

export const publishResume = async (slug: string, data: ResumeData): Promise<void> => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const path = `published_resumes/${slug}`;
  try {
    const resumeRef = doc(db, 'published_resumes', slug);
    const docSnap = await getDoc(resumeRef);
    
    // If it exists and belongs to someone else, throw error
    if (docSnap.exists() && docSnap.data().userId !== auth.currentUser.uid) {
      throw new Error('This URL slug is already taken by another user.');
    }
    
    const payload: any = {
      userId: auth.currentUser.uid,
      slug: slug,
      data: JSON.stringify(data),
    };

    if (!docSnap.exists()) {
      payload.publishedAt = serverTimestamp();
      payload.views = 0;
    }

    await setDoc(resumeRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getPublishedResume = async (slug: string): Promise<PublishedResume | null> => {
  const path = `published_resumes/${slug}`;
  try {
    const docRef = doc(db, 'published_resumes', slug);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        slug: docSnap.id,
        userId: data.userId,
        publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : new Date(),
        views: data.views || 0,
        data: JSON.parse(data.data) as ResumeData
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const incrementResumeViews = async (slug: string, location: string, userAgent: string): Promise<string | null> => {
  const path = `published_resumes/${slug}`;
  try {
    const docRef = doc(db, 'published_resumes', slug);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      
      // Increment views
      await setDoc(docRef, { views: currentViews + 1 }, { merge: true });
      
      // Record view event
      const viewRef = doc(collection(db, `published_resumes/${slug}/views`));
      await setDoc(viewRef, {
        publishedResumeId: slug,
        viewedAt: serverTimestamp(),
        location: location.substring(0, 200),
        userAgent: userAgent.substring(0, 500),
        timeSpent: 0
      });
      return viewRef.id;
    }
    return null;
  } catch (error) {
    // Don't throw for analytics errors, just log
    console.error('Failed to increment views:', error);
    return null;
  }
};

export const updateViewTime = async (slug: string, viewId: string, timeSpentSeconds: number): Promise<void> => {
  try {
    const viewRef = doc(db, `published_resumes/${slug}/views`, viewId);
    await setDoc(viewRef, { timeSpent: timeSpentSeconds }, { merge: true });
  } catch (error) {
    console.error('Failed to update view time:', error);
  }
};

export const subscribeToResumeAnalytics = (
  slug: string,
  onData: (data: { views: number, recentViews: any[] }) => void,
  onError: (error: Error) => void
) => {
  if (!auth.currentUser) {
    onError(new Error('User not authenticated'));
    return () => {};
  }

  const docRef = doc(db, 'published_resumes', slug);
  const viewsRef = collection(db, `published_resumes/${slug}/views`);

  let currentViews = 0;
  let currentRecentViews: any[] = [];

  const updateCallback = () => {
    onData({ views: currentViews, recentViews: currentRecentViews });
  };

  const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists() || docSnap.data().userId !== auth.currentUser?.uid) {
      onError(new Error('Unauthorized or not found'));
      return;
    }
    currentViews = docSnap.data().views || 0;
    updateCallback();
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.GET, `published_resumes/${slug}`);
    } catch (e: any) {
      onError(e);
    }
  });

  const unsubscribeViews = onSnapshot(viewsRef, (querySnapshot) => {
    currentRecentViews = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        viewedAt: data.viewedAt instanceof Timestamp ? data.viewedAt.toDate() : new Date(),
        location: data.location || 'Unknown',
        userAgent: data.userAgent || 'Unknown',
        timeSpent: data.timeSpent || 0
      };
    }).sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime()).slice(0, 50);
    
    updateCallback();
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.LIST, `published_resumes/${slug}/views`);
    } catch (e: any) {
      onError(e);
    }
  });

  return () => {
    unsubscribeDoc();
    unsubscribeViews();
  };
};
