import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupytercustomsort-labext extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupytercustomsort-labext:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupytercustomsort-labext is activated!');
  }
};

export default plugin;
