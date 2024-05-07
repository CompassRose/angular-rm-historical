import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/edit/closetag';
import 'codemirror/lib/codemirror';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/indent-fold';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
