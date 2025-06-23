export type ContactType = 'trusted' | 'blocked' | 'unsaved';

export interface Contact {
  email: string;
  type: ContactType;
  createdAt: string;
}

const STORAGE_KEY = 'contacts';

function getAllContacts(): Promise<Contact[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (res) => {
      resolve(res[STORAGE_KEY] || []);
    });
  });
}

export async function saveContact(email: string, type: ContactType): Promise<void> {
  const contacts = await getAllContacts();
  const exists = contacts.find(c => c.email === email);

  if (!exists) {
    contacts.push({
      email,
      type,
      createdAt: new Date().toISOString(),
    });
    chrome.storage.local.set({ [STORAGE_KEY]: contacts });
  }
}

export async function getContact(email: string): Promise<Contact | undefined> {
  const contacts = await getAllContacts();
  return contacts.find(c => c.email === email);
}

export async function listContacts(type?: ContactType): Promise<Contact[]> {
  const contacts = await getAllContacts();
  return type ? contacts.filter(c => c.type === type) : contacts;
}

export async function deleteContact(email: string): Promise<void> {
  let contacts = await getAllContacts();
  contacts = contacts.filter(c => c.email !== email);
  chrome.storage.local.set({ [STORAGE_KEY]: contacts });
}

export async function findSimilarContacts(email: string, maxDistance = 6): Promise<Contact[]> {
    const contacts = await getAllContacts();
    const baseEmail = email.split('@')[0];  // pega só a parte antes do @

    // contacts.forEach(c => {
    //     const cBase = c.email.split('@')[0]; // parte antes do @ do contato        
    //     let distance = levenshteinDistance(cBase, baseEmail)
    //     console.log('contato salvo: ', cBase, 'contato sendo comparado: ', baseEmail, 'disntace: ', distance)
    // })

    return contacts.filter(c => {
        const cBase = c.email.split('@')[0]; // parte antes do @ do contato        
        return (c.email !== email) && (levenshteinDistance(cBase, baseEmail) <= maxDistance)
    });
}

// Simple Levenshtein Distance implementation
function levenshteinDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,     // deletion
        dp[i][j - 1] + 1,     // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[a.length][b.length];
}
