import { db, auth } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
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

export const deleteResume = async (resumeId: string): Promise<void> => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const path = `resumes/${resumeId}`;
  try {
    await deleteDoc(doc(db, 'resumes', resumeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};
