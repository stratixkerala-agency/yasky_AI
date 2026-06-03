import { db } from './firebase';
import {
  doc, setDoc, getDoc, getDocs, deleteDoc,
  collection, query, where, orderBy, limit,
  Timestamp, writeBatch
} from 'firebase/firestore';
import type { ChatMessage } from './ai';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export interface Conversation {
  id: string;
  roleId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

function getConversationsRef(userId: string) {
  if (!db) throw new Error('Firestore not initialized');
  return collection(db, 'users', userId, 'conversations');
}

function getMessagesRef(userId: string, conversationId: string) {
  if (!db) throw new Error('Firestore not initialized');
  return collection(db, 'users', userId, 'conversations', conversationId, 'messages');
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  const ref = getConversationsRef(userId);
  const now = Date.now();
  const cutoff = Timestamp.fromMillis(now - SEVEN_DAYS_MS);

  const q = query(ref, where('createdAt', '>=', cutoff), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  const results: Conversation[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    results.push({
      id: doc.id,
      roleId: data.roleId,
      title: data.title,
      createdAt: data.createdAt.toMillis(),
      updatedAt: data.updatedAt.toMillis(),
      messageCount: data.messageCount,
    });
  });

  const oldQ = query(ref, where('createdAt', '<', cutoff));
  const oldSnapshot = await getDocs(oldQ);
  if (!oldSnapshot.empty) {
    const batch = writeBatch(db!);
    oldSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  return results;
}

export async function createConversation(
  userId: string,
  conversationId: string,
  roleId: string
): Promise<void> {
  const ref = getConversationsRef(userId);
  const now = Timestamp.now();
  await setDoc(doc(ref, conversationId), {
    roleId,
    title: 'New conversation',
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
  });
}

export async function updateConversationTitle(
  userId: string,
  conversationId: string,
  title: string
): Promise<void> {
  const ref = getConversationsRef(userId);
  await setDoc(doc(ref, conversationId), { title, updatedAt: Timestamp.now() }, { merge: true });
}

export async function getMessages(
  userId: string,
  conversationId: string
): Promise<ChatMessage[]> {
  const ref = getMessagesRef(userId, conversationId);
  const q = query(ref, orderBy('timestamp', 'asc'));
  const snapshot = await getDocs(q);

  const messages: ChatMessage[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    messages.push({
      id: doc.id,
      role: data.role,
      content: data.content,
      timestamp: data.timestamp,
    });
  });
  return messages;
}

export async function saveMessage(
  userId: string,
  conversationId: string,
  message: ChatMessage
): Promise<void> {
  const msgRef = doc(getMessagesRef(userId, conversationId), message.id);
  await setDoc(msgRef, {
    role: message.role,
    content: message.content,
    timestamp: message.timestamp,
  });
}

export async function incrementMessageCount(
  userId: string,
  conversationId: string
): Promise<void> {
  const convRef = doc(getConversationsRef(userId), conversationId);
  await setDoc(convRef, {
    updatedAt: Timestamp.now(),
    messageCount: (await getDoc(convRef)).data()?.messageCount + 1 || 1,
  }, { merge: true });
}
