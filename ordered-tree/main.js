define([
  'base/js/namespace'
], function(
  Jupyter
){
  let NBList = Jupyter.notebook_list;

  function sort_function(file_order, name_sorter) {
    return function(a, b) {
      if (a['type'] != b['type'])
        return name_sorter(a, b);

      let aIndex = file_order.indexOf(a['name']);
      let bIndex = file_order.indexOf(b['name']);
      if (aIndex > -1 && bIndex > -1)
        return aIndex < bIndex ? -1 : 1;
      else if (aIndex > -1)
        return -1;
      else if (bIndex > -1)
        return 1;
      return name_sorter(a, b);
    }
  }

  function create_sort_handler(file_order, name_sorter) {
    return function() {
      // Clear sort indications
      $('.sort-action i').removeClass('fa-arrow-up').removeClass('fa-arrow-down');
      $('#ordered-tree i').addClass('fa-arrow-down');

      NBList.sort_function = sort_function(file_order, name_sorter);
      NBList.draw_notebook_list(NBList.model_list, NBList.error_msg);
      NBList.sort_id = 'ordered-tree'
    }
  }

  async function get_file_order() {
    let order_file = `${NBList.base_url}files/${NBList.notebook_path}/_file_order`;
    let response = await fetch(order_file);
    return await response.json();
  }

  function load_ipython_extension() {
    get_file_order().then((file_order) => {
      let buttonContainer = document.querySelector('#sort_buttons');
      buttonContainer.insertAdjacentHTML('afterbegin', `
        <div id="ordered_tree" class="sort_button">
          <button id="ordered-tree" class="btn btn-xs btn-default sort-action" type="button" aria-label="Sort by Order">
            Order
            <i class="fa"></i>
          </button>
        </div>
      `);

      let name_sorter = NBList.sort_function;
      let sort_handler = create_sort_handler(file_order, name_sorter);
      $('#ordered-tree').click(sort_handler);
      sort_handler();
    }).catch((error) => {
      console.log('Problem getting file order:');
      console.log(error);
    })
  }

  return {
    load_ipython_extension: load_ipython_extension
  };
})
