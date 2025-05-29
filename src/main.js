import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import './assets/main.css';

// Initialize Vuetify
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'lightTheme',
    themes: {
      lightTheme: {
        dark: false,
        colors: {
          primary: '#1F2937',
          secondary: '#4B5563',
          accent: '#3B82F6',
          error: '#EF4444',
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B'
        }
      },
      darkTheme: {
        dark: true,
        colors: {
          primary: '#3B82F6',
          secondary: '#6B7280',
          accent: '#60A5FA',
          error: '#F87171',
          info: '#60A5FA',
          success: '#34D399',
          warning: '#FBBF24'
        }
      }
    }
  }
});

// Create Vue app
const app = createApp(App);

// Use plugins
app.use(router);
app.use(store);
app.use(vuetify);

// Mount the app
app.mount('#app');
