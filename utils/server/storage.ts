import { Conversation } from '@/types/chat';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';
import { Settings } from '@/types/settings';

import { MONGODB_DB } from '../app/const';

import { Collection, Db, MongoClient } from 'mongodb';

let _db: Db | null = null;
export async function getDb(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }
  if (_db !== null) {
    return _db;
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  let db = client.db(MONGODB_DB);
  _db = db;
  return db;
}

export interface ConversationCollectionItem {
  userHash: string;
  conversation: Conversation;
}
export interface PromptsCollectionItem {
  userHash: string;
  prompt: Prompt;
}

export interface FoldersCollectionItem {
  userHash: string;
  folder: FolderInterface;
}

export interface SettingsCollectionItem {
  userHash: string;
  settings: Settings;
}

export class UserDb {
  private _conversations: Collection<ConversationCollectionItem>;
  private _folders: Collection<FoldersCollectionItem>;
  private _prompts: Collection<PromptsCollectionItem>;
  private _settings: Collection<SettingsCollectionItem>;

  constructor(_db: Db, private _userId: string) {
    this._conversations =
      _db.collection<ConversationCollectionItem>('conversations');
    this._folders = _db.collection<FoldersCollectionItem>('folders');
    this._prompts = _db.collection<PromptsCollectionItem>('prompts');
    this._settings = _db.collection<SettingsCollectionItem>('settings');
  }

  static async fromUserHash(userId: string): Promise<UserDb> {
    return new UserDb(await getDb(), userId);
  }

  async getConversations(): Promise<Conversation[]> {
    return (
      await this._conversations.find({ userHash: this._userId }).toArray()
    ).map((item) => item.conversation);
  }

  async saveConversation(conversation: Conversation) {
    return this._conversations.updateOne(
      { userHash: this._userId, 'conversation.id': conversation.id },
      { $set: { conversation } },
      { upsert: true },
    );
  }

  async saveConversations(conversations: Conversation[]) {
    for (const conversation of conversations) {
      await this.saveConversation(conversation);
    }
  }
  removeConversation(id: string) {
    this._conversations.deleteOne({
      userHash: this._userId,
      'conversation.id': id,
    });
  }

  removeAllConversations() {
    this._conversations.deleteMany({ userHash: this._userId });
  }

  async getFolders(): Promise<FolderInterface[]> {
    const items = await this._folders
      .find({ userHash: this._userId })
      .toArray();
    return items.map((item) => item.folder);
  }

  async saveFolder(folder: FolderInterface) {
    return this._folders.updateOne(
      { userHash: this._userId, 'folder.id': folder.id },
      { $set: { folder } },
      { upsert: true },
    );
  }

  async saveFolders(folders: FolderInterface[]) {
    for (const folder of folders) {
      await this.saveFolder(folder);
    }
  }

  async getPrompts(): Promise<Prompt[]> {
    const items = await this._prompts
      .find({ userHash: this._userId })
      .toArray();
    return items.map((item) => item.prompt);
  }

  async savePrompt(prompt: Prompt) {
    return this._prompts.updateOne(
      { userHash: this._userId, 'prompt.id': prompt.id },
      { $set: { prompt } },
      { upsert: true },
    );
  }

  async savePrompts(prompts: Prompt[]) {
    for (const prompt of prompts) {
      await this.savePrompt(prompt);
    }
  }

  async getSettings(): Promise<Settings> {
    const item = await this._settings.findOne({ userHash: this._userId });
    if (item) {
      return item.settings;
    }
    return {
      userId: this._userId,
      theme: 'dark',
      defaultTemperature: 1.0,
    };
  }

  async saveSettings(settings: Settings) {
    settings.userId = this._userId;
    return this._settings.updateOne(
      { userHash: this._userId },
      { $set: { settings } },
      { upsert: true },
    );
  }
}
