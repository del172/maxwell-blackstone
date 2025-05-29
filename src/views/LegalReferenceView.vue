<template>
  <div class="legal-reference">
    <h1>Legal Reference</h1>
    
    <v-card>
      <v-tabs v-model="activeTab">
        <v-tab value="legislation">Legislation</v-tab>
        <v-tab value="case-law">Case Law</v-tab>
        <v-tab value="guidance">CPS Guidance</v-tab>
      </v-tabs>
      
      <v-card-text>
        <v-window v-model="activeTab">
          <!-- Legislation Tab -->
          <v-window-item value="legislation">
            <v-text-field
              v-model="search"
              label="Search legislation"
              prepend-icon="mdi-magnify"
              clearable
              @keyup.enter="searchLegislation"
            ></v-text-field>
            
            <v-data-table
              :headers="legislationHeaders"
              :items="legislation"
              :loading="loading"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon small @click="viewLegislation(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon small @click="saveLegislation(item)">
                  <v-icon>mdi-bookmark</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-window-item>
          
          <!-- Case Law Tab -->
          <v-window-item value="case-law">
            <v-text-field
              v-model="search"
              label="Search case law"
              prepend-icon="mdi-magnify"
              clearable
              @keyup.enter="searchCaseLaw"
            ></v-text-field>
            
            <v-data-table
              :headers="caseLawHeaders"
              :items="caseLaw"
              :loading="loading"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon small @click="viewCaseLaw(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon small @click="saveCaseLaw(item)">
                  <v-icon>mdi-bookmark</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-window-item>
          
          <!-- CPS Guidance Tab -->
          <v-window-item value="guidance">
            <v-text-field
              v-model="search"
              label="Search CPS guidance"
              prepend-icon="mdi-magnify"
              clearable
              @keyup.enter="searchGuidance"
            ></v-text-field>
            
            <v-data-table
              :headers="guidanceHeaders"
              :items="guidance"
              :loading="loading"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon small @click="viewGuidance(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon small @click="saveGuidance(item)">
                  <v-icon>mdi-bookmark</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
    
    <!-- Reference Detail Dialog -->
    <v-dialog v-model="showDetailDialog" max-width="800px">
      <v-card>
        <v-card-title>{{ detailItem.title }}</v-card-title>
        <v-card-subtitle v-if="detailItem.reference">{{ detailItem.reference }}</v-card-subtitle>
        
        <v-card-text>
          <div v-if="detailItem.content" v-html="detailItem.content"></div>
          <div v-else>{{ detailItem.summary }}</div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDetailDialog = false">Close</v-btn>
          <v-btn color="primary" @click="saveToCase">Save to Case</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Save to Case Dialog -->
    <v-dialog v-model="showSaveDialog" max-width="500px">
      <v-card>
        <v-card-title>Save to Case</v-card-title>
        
        <v-card-text>
          <v-select
            v-model="selectedCaseId"
            :items="caseOptions"
            label="Select Case"
            item-text="text"
            item-value="value"
            :rules="[v => !!v || 'Please select a case']"
          ></v-select>
          
          <v-textarea
            v-model="saveNotes"
            label="Notes"
            hint="Optional notes about relevance"
          ></v-textarea>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showSaveDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            :disabled="!selectedCaseId"
            @click="confirmSaveToCase"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'LegalReferenceView',
  data() {
    return {
      activeTab: 'legislation',
      search: '',
      loading: false,
      showDetailDialog: false,
      showSaveDialog: false,
      detailItem: {},
      selectedCaseId: null,
      saveNotes: '',
      
      legislationHeaders: [
        { text: 'Title', value: 'title' },
        { text: 'Year', value: 'year' },
        { text: 'Reference', value: 'reference' },
        { text: 'Category', value: 'category' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      legislation: [],
      
      caseLawHeaders: [
        { text: 'Case Name', value: 'title' },
        { text: 'Year', value: 'year' },
        { text: 'Citation', value: 'citation' },
        { text: 'Court', value: 'court' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      caseLaw: [],
      
      guidanceHeaders: [
        { text: 'Title', value: 'title' },
        { text: 'Category', value: 'category' },
        { text: 'Last Updated', value: 'updated' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      guidance: []
    };
  },
  computed: {
    cases() {
      return this.$store.getters.getCases;
    },
    caseOptions() {
      return this.cases.map(c => ({
        text: `${c.defendant} (${c.reference || 'No reference'})`,
        value: c.id
      }));
    },
    isOffline() {
      return this.$store.getters.isOffline;
    }
  },
  created() {
    this.loadLegalReferences();
  },
  methods: {
    async loadLegalReferences() {
      this.loading = true;
      try {
        // Load legislation
        await this.$store.dispatch('loadLegalReferences');
        this.legislation = this.$store.getters.getLegalReferences;
        
        // In a real app, we would also load case law and guidance
        // For now, using placeholder data
        this.caseLaw = [
          {
            id: 'case_001',
            title: 'R v Smith',
            year: 2020,
            citation: '[2020] EWCA Crim 1234',
            court: 'Court of Appeal',
            summary: 'Appeal against conviction for theft...'
          },
          {
            id: 'case_002',
            title: 'R v Jones',
            year: 2019,
            citation: '[2019] UKSC 12',
            court: 'Supreme Court',
            summary: 'Appeal concerning admissibility of evidence...'
          }
        ];
        
        this.guidance = [
          {
            id: 'guidance_001',
            title: 'Theft Act Offences',
            category: 'Charging',
            updated: '2023-01-15',
            summary: 'Guidance on charging decisions for Theft Act offences...'
          },
          {
            id: 'guidance_002',
            title: 'Disclosure Manual',
            category: 'Disclosure',
            updated: '2022-11-30',
            summary: 'Guidance on meeting disclosure obligations...'
          }
        ];
      } catch (error) {
        console.error('Failed to load legal references:', error);
      } finally {
        this.loading = false;
      }
    },
    
    searchLegislation() {
      // In a real app, this would search the API or IndexedDB
      console.log('Searching legislation for:', this.search);
    },
    
    searchCaseLaw() {
      // In a real app, this would search the API or IndexedDB
      console.log('Searching case law for:', this.search);
    },
    
    searchGuidance() {
      // In a real app, this would search the API or IndexedDB
      console.log('Searching guidance for:', this.search);
    },
    
    viewLegislation(item) {
      this.detailItem = item;
      this.showDetailDialog = true;
    },
    
    viewCaseLaw(item) {
      this.detailItem = item;
      this.showDetailDialog = true;
    },
    
    viewGuidance(item) {
      this.detailItem = item;
      this.showDetailDialog = true;
    },
    
    saveLegislation(item) {
      this.detailItem = item;
      this.showSaveDialog = true;
    },
    
    saveCaseLaw(item) {
      this.detailItem = item;
      this.showSaveDialog = true;
    },
    
    saveGuidance(item) {
      this.detailItem = item;
      this.showSaveDialog = true;
    },
    
    saveToCase() {
      this.showDetailDialog = false;
      this.showSaveDialog = true;
    },
    
    confirmSaveToCase() {
      // In a real app, this would save the reference to the selected case
      console.log('Saving reference to case:', this.selectedCaseId);
      console.log('Reference:', this.detailItem);
      console.log('Notes:', this.saveNotes);
      
      // Show success message
      this.$root.$emit('show-snackbar', {
        text: 'Reference saved to case',
        color: 'success'
      });
      
      this.showSaveDialog = false;
      this.selectedCaseId = null;
      this.saveNotes = '';
    }
  }
};
</script>
