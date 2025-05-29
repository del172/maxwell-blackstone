import { createStore } from 'vuex';
import { openDB } from 'idb';

// Initialize IndexedDB
const initDatabase = async () => {
  return openDB('MaxwellBlackstone', 1, {
    upgrade(db) {
      // Create object stores
      if (!db.objectStoreNames.contains('cases')) {
        const casesStore = db.createObjectStore('cases', { keyPath: 'id' });
        casesStore.createIndex('defendant', 'defendant', { unique: false });
        casesStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('evidence')) {
        const evidenceStore = db.createObjectStore('evidence', { keyPath: 'id' });
        evidenceStore.createIndex('caseId', 'caseId', { unique: false });
        evidenceStore.createIndex('type', 'type', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('analysis')) {
        db.createObjectStore('analysis', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('defenceStrategies')) {
        db.createObjectStore('defenceStrategies', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('legalReferences')) {
        db.createObjectStore('legalReferences', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    }
  });
};

export default createStore({
  state: {
    isOffline: !navigator.onLine,
    cases: [],
    currentCase: null,
    legalReferences: [],
    isLoading: false,
    error: null,
    db: null
  },
  getters: {
    getCases: state => state.cases,
    getCurrentCase: state => state.currentCase,
    getLegalReferences: state => state.legalReferences,
    isOffline: state => state.isOffline
  },
  mutations: {
    SET_OFFLINE_STATUS(state, status) {
      state.isOffline = status;
    },
    SET_CASES(state, cases) {
      state.cases = cases;
    },
    SET_CURRENT_CASE(state, caseData) {
      state.currentCase = caseData;
    },
    SET_LEGAL_REFERENCES(state, references) {
      state.legalReferences = references;
    },
    SET_LOADING(state, status) {
      state.isLoading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_DATABASE(state, db) {
      state.db = db;
    }
  },
  actions: {
    async initializeDatabase({ commit }) {
      try {
        const db = await initDatabase();
        commit('SET_DATABASE', db);
        return db;
      } catch (error) {
        commit('SET_ERROR', 'Failed to initialize database: ' + error.message);
        throw error;
      }
    },
    
    setOfflineStatus({ commit }, status) {
      commit('SET_OFFLINE_STATUS', status);
    },
    
    async loadCases({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        
        if (!state.db) {
          await this.dispatch('initializeDatabase');
        }
        
        const tx = state.db.transaction('cases', 'readonly');
        const store = tx.objectStore('cases');
        const cases = await store.getAll();
        
        commit('SET_CASES', cases);
        commit('SET_LOADING', false);
        return cases;
      } catch (error) {
        commit('SET_ERROR', 'Failed to load cases: ' + error.message);
        commit('SET_LOADING', false);
        throw error;
      }
    },
    
    async createCase({ commit, state }, caseData) {
      try {
        if (!state.db) {
          await this.dispatch('initializeDatabase');
        }
        
        const newCase = {
          ...caseData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const tx = state.db.transaction('cases', 'readwrite');
        await tx.objectStore('cases').add(newCase);
        await tx.done;
        
        // Refresh cases list
        this.dispatch('loadCases');
        
        return newCase;
      } catch (error) {
        commit('SET_ERROR', 'Failed to create case: ' + error.message);
        throw error;
      }
    },
    
    async loadLegalReferences({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        
        let references = [];
        
        // Try to load from IndexedDB first (for offline access)
        if (state.db) {
          const tx = state.db.transaction('legalReferences', 'readonly');
          const store = tx.objectStore('legalReferences');
          references = await store.getAll();
        }
        
        // If online and no cached references, fetch from API
        if (!state.isOffline && references.length === 0) {
          const response = await fetch('/api/legal-reference/legislation');
          if (response.ok) {
            references = await response.json();
            
            // Cache for offline use
            if (state.db) {
              const tx = state.db.transaction('legalReferences', 'readwrite');
              const store = tx.objectStore('legalReferences');
              
              for (const ref of references) {
                await store.put(ref);
              }
              
              await tx.done;
            }
          }
        }
        
        commit('SET_LEGAL_REFERENCES', references);
        commit('SET_LOADING', false);
        return references;
      } catch (error) {
        commit('SET_ERROR', 'Failed to load legal references: ' + error.message);
        commit('SET_LOADING', false);
        throw error;
      }
    }
  },
  modules: {
  }
});
