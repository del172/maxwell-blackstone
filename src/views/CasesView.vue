<template>
  <div class="cases">
    <h1>Cases</h1>
    
    <v-card class="mb-4">
      <v-card-title>
        <v-row align="center">
          <v-col cols="8">
            <h2>My Cases</h2>
          </v-col>
          <v-col cols="4" class="text-right">
            <v-btn color="primary" @click="showNewCaseDialog = true">
              New Case
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Search cases"
          prepend-icon="mdi-magnify"
          clearable
        ></v-text-field>
        
        <v-data-table
          :headers="headers"
          :items="filteredCases"
          :search="search"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn icon small @click="viewCase(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
          
          <template v-slot:no-data>
            <div class="text-center pa-5">
              <p>No cases found. Create your first case to get started.</p>
              <v-btn color="primary" @click="showNewCaseDialog = true">
                Create Case
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    
    <!-- New Case Dialog -->
    <v-dialog v-model="showNewCaseDialog" max-width="600px">
      <v-card>
        <v-card-title>New Case</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newCase.defendant"
              label="Defendant Name"
              required
              :rules="[v => !!v || 'Defendant name is required']"
            ></v-text-field>
            
            <v-text-field
              v-model="newCase.reference"
              label="Case Reference"
              hint="Optional reference number"
            ></v-text-field>
            
            <v-combobox
              v-model="newCase.charges"
              label="Charges"
              multiple
              chips
              small-chips
              hint="Enter charges and press Enter"
              :rules="[v => v.length > 0 || 'At least one charge is required']"
            ></v-combobox>
            
            <v-textarea
              v-model="newCase.summary"
              label="Case Summary"
              hint="Brief description of the case"
              :rules="[v => !!v || 'Case summary is required']"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showNewCaseDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            :disabled="!valid"
            @click="createCase"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'CasesView',
  data() {
    return {
      search: '',
      loading: false,
      showNewCaseDialog: false,
      valid: false,
      headers: [
        { text: 'Defendant', value: 'defendant' },
        { text: 'Reference', value: 'reference' },
        { text: 'Charges', value: 'charges' },
        { text: 'Created', value: 'createdAt' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      newCase: {
        defendant: '',
        reference: '',
        charges: [],
        summary: ''
      }
    };
  },
  computed: {
    cases() {
      return this.$store.getters.getCases;
    },
    filteredCases() {
      return this.cases.map(c => ({
        ...c,
        charges: c.charges.join(', '),
        createdAt: new Date(c.createdAt).toLocaleDateString()
      }));
    }
  },
  created() {
    this.loadCases();
  },
  methods: {
    async loadCases() {
      this.loading = true;
      try {
        await this.$store.dispatch('loadCases');
      } catch (error) {
        console.error('Failed to load cases:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async createCase() {
      if (!this.$refs.form.validate()) return;
      
      try {
        await this.$store.dispatch('createCase', this.newCase);
        this.showNewCaseDialog = false;
        this.resetForm();
      } catch (error) {
        console.error('Failed to create case:', error);
      }
    },
    
    viewCase(item) {
      this.$router.push({ name: 'CaseDetail', params: { id: item.id } });
    },
    
    resetForm() {
      this.newCase = {
        defendant: '',
        reference: '',
        charges: [],
        summary: ''
      };
      this.$refs.form.resetValidation();
    }
  }
};
</script>
