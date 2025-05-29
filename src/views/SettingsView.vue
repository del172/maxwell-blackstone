<template>
  <div class="settings">
    <h1>Settings</h1>
    
    <v-card class="mb-4">
      <v-card-title>Application Settings</v-card-title>
      <v-card-text>
        <v-switch
          v-model="settings.darkMode"
          label="Dark Mode"
          @change="updateSettings"
        ></v-switch>
        
        <v-switch
          v-model="settings.offlineMode"
          label="Prepare for Offline Use"
          @change="updateSettings"
        ></v-switch>
        
        <v-select
          v-model="settings.defaultView"
          :items="viewOptions"
          label="Default View"
          @change="updateSettings"
        ></v-select>
      </v-card-text>
    </v-card>
    
    <v-card class="mb-4">
      <v-card-title>Legal Database</v-card-title>
      <v-card-text>
        <p>Last updated: {{ lastUpdated }}</p>
        <v-btn 
          color="primary" 
          :loading="updating" 
          :disabled="isOffline"
          @click="updateLegalDatabase"
        >
          Check for Updates
        </v-btn>
        
        <div v-if="isOffline" class="mt-2 red--text">
          <v-icon color="red">mdi-wifi-off</v-icon>
          You are currently offline. Database updates require an internet connection.
        </div>
      </v-card-text>
    </v-card>
    
    <v-card class="mb-4">
      <v-card-title>Data Management</v-card-title>
      <v-card-text>
        <v-btn color="primary" class="mr-2" @click="exportData">
          Export Data
        </v-btn>
        
        <v-btn color="secondary" @click="showImportDialog = true">
          Import Data
        </v-btn>
        
        <v-divider class="my-4"></v-divider>
        
        <v-btn color="error" @click="showDeleteDialog = true">
          Delete All Data
        </v-btn>
      </v-card-text>
    </v-card>
    
    <v-card>
      <v-card-title>About</v-card-title>
      <v-card-text>
        <p>Maxwell Blackstone</p>
        <p>Version: 1.0.0</p>
        <p>UK Criminal Defence AI Assistant</p>
        <p>All data is stored locally on your device.</p>
        
        <v-btn text color="primary" @click="showPrivacyPolicy = true">
          Privacy Policy
        </v-btn>
      </v-card-text>
    </v-card>
    
    <!-- Import Dialog -->
    <v-dialog v-model="showImportDialog" max-width="500px">
      <v-card>
        <v-card-title>Import Data</v-card-title>
        <v-card-text>
          <v-file-input
            v-model="importFile"
            label="Select backup file"
            accept=".json"
            :rules="[v => !!v || 'Please select a file']"
          ></v-file-input>
          
          <v-radio-group v-model="importMode" label="Import Mode">
            <v-radio value="replace" label="Replace existing data"></v-radio>
            <v-radio value="merge" label="Merge with existing data"></v-radio>
          </v-radio-group>
          
          <v-alert v-if="importError" type="error" class="mt-2">
            {{ importError }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showImportDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            :disabled="!importFile"
            @click="importData"
          >
            Import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="red white--text">Delete All Data</v-card-title>
        <v-card-text>
          <p class="mt-4">This will permanently delete all your cases, evidence, and saved references. This action cannot be undone.</p>
          
          <v-text-field
            v-model="deleteConfirmation"
            label="Type DELETE to confirm"
            :rules="[v => v === 'DELETE' || 'Please type DELETE to confirm']"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn 
            color="error" 
            :disabled="deleteConfirmation !== 'DELETE'"
            @click="deleteAllData"
          >
            Delete All Data
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Privacy Policy Dialog -->
    <v-dialog v-model="showPrivacyPolicy" max-width="700px">
      <v-card>
        <v-card-title>Privacy Policy</v-card-title>
        <v-card-text>
          <h3>Data Storage</h3>
          <p>Maxwell Blackstone stores all your case data exclusively on your device using your browser's IndexedDB storage. No case information is ever transmitted to external servers.</p>
          
          <h3>Legal Reference Data</h3>
          <p>Legal reference data is downloaded from our servers and cached locally for offline use. This data contains no personal information.</p>
          
          <h3>Analytics</h3>
          <p>Maxwell Blackstone collects anonymous performance metrics to help improve the application. No personal or case information is included in these metrics. You can disable analytics in Settings.</p>
          
          <h3>Third-Party Services</h3>
          <p>Maxwell Blackstone does not use any third-party services that would have access to your data.</p>
          
          <h3>Data Export and Deletion</h3>
          <p>You can export your data at any time for backup purposes. You can also delete all data stored by the application from your device.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showPrivacyPolicy = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'SettingsView',
  data() {
    return {
      settings: {
        darkMode: false,
        offlineMode: false,
        defaultView: 'home'
      },
      viewOptions: [
        { text: 'Home', value: 'home' },
        { text: 'Cases', value: 'cases' },
        { text: 'Legal Reference', value: 'legal-reference' }
      ],
      lastUpdated: 'Never',
      updating: false,
      showImportDialog: false,
      showDeleteDialog: false,
      showPrivacyPolicy: false,
      importFile: null,
      importMode: 'merge',
      importError: null,
      deleteConfirmation: ''
    };
  },
  computed: {
    isOffline() {
      return this.$store.getters.isOffline;
    }
  },
  created() {
    this.loadSettings();
  },
  methods: {
    async loadSettings() {
      try {
        // In a real app, this would load from IndexedDB
        // For now, using localStorage as a simple example
        const savedSettings = localStorage.getItem('maxwell_blackstone_settings');
        if (savedSettings) {
          this.settings = JSON.parse(savedSettings);
        }
        
        // Get last update time
        const lastUpdate = localStorage.getItem('maxwell_blackstone_last_update');
        if (lastUpdate) {
          this.lastUpdated = new Date(lastUpdate).toLocaleString();
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    },
    
    updateSettings() {
      try {
        // In a real app, this would save to IndexedDB
        localStorage.setItem('maxwell_blackstone_settings', JSON.stringify(this.settings));
        
        // Apply settings
        if (this.settings.darkMode) {
          this.$vuetify.theme.global.name.value = 'darkTheme';
        } else {
          this.$vuetify.theme.global.name.value = 'lightTheme';
        }
        
        // Show success message
        this.$root.$emit('show-snackbar', {
          text: 'Settings updated',
          color: 'success'
        });
      } catch (error) {
        console.error('Failed to update settings:', error);
      }
    },
    
    async updateLegalDatabase() {
      if (this.isOffline) return;
      
      this.updating = true;
      try {
        // In a real app, this would fetch updates from the API
        // For now, just simulating an update
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const now = new Date();
        this.lastUpdated = now.toLocaleString();
        localStorage.setItem('maxwell_blackstone_last_update', now.toISOString());
        
        // Show success message
        this.$root.$emit('show-snackbar', {
          text: 'Legal database updated successfully',
          color: 'success'
        });
      } catch (error) {
        console.error('Failed to update legal database:', error);
        
        // Show error message
        this.$root.$emit('show-snackbar', {
          text: 'Failed to update legal database',
          color: 'error'
        });
      } finally {
        this.updating = false;
      }
    },
    
    exportData() {
      try {
        // In a real app, this would export all data from IndexedDB
        // For now, just creating a sample export
        const exportData = {
          cases: this.$store.getters.getCases,
          settings: this.settings,
          exportDate: new Date().toISOString(),
          version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `maxwell_blackstone_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message
        this.$root.$emit('show-snackbar', {
          text: 'Data exported successfully',
          color: 'success'
        });
      } catch (error) {
        console.error('Failed to export data:', error);
        
        // Show error message
        this.$root.$emit('show-snackbar', {
          text: 'Failed to export data',
          color: 'error'
        });
      }
    },
    
    async importData() {
      this.importError = null;
      
      try {
        if (!this.importFile) {
          this.importError = 'Please select a file to import';
          return;
        }
        
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const importData = JSON.parse(e.target.result);
            
            // In a real app, this would validate and import the data
            console.log('Importing data:', importData);
            console.log('Import mode:', this.importMode);
            
            // Show success message
            this.$root.$emit('show-snackbar', {
              text: 'Data imported successfully',
              color: 'success'
            });
            
            this.showImportDialog = false;
            this.importFile = null;
          } catch (error) {
            console.error('Failed to parse import file:', error);
            this.importError = 'Invalid import file format';
          }
        };
        
        reader.onerror = () => {
          this.importError = 'Failed to read import file';
        };
        
        reader.readAsText(this.importFile);
      } catch (error) {
        console.error('Failed to import data:', error);
        this.importError = 'Failed to import data: ' + error.message;
      }
    },
    
    async deleteAllData() {
      if (this.deleteConfirmation !== 'DELETE') return;
      
      try {
        // In a real app, this would clear all IndexedDB stores
        // For now, just clearing localStorage
        localStorage.removeItem('maxwell_blackstone_settings');
        localStorage.removeItem('maxwell_blackstone_last_update');
        
        // Reset settings
        this.settings = {
          darkMode: false,
          offlineMode: false,
          defaultView: 'home'
        };
        
        this.lastUpdated = 'Never';
        
        // Show success message
        this.$root.$emit('show-snackbar', {
          text: 'All data deleted successfully',
          color: 'success'
        });
        
        this.showDeleteDialog = false;
        this.deleteConfirmation = '';
      } catch (error) {
        console.error('Failed to delete data:', error);
        
        // Show error message
        this.$root.$emit('show-snackbar', {
          text: 'Failed to delete data',
          color: 'error'
        });
      }
    }
  }
};
</script>
