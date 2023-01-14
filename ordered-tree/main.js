define([
  'base/js/namespace'
], function(
  Jupyter
){
  let NBList = Jupyter.notebook_list;
  let name_sorter = NBList.sort_function;

  function sort_function(a, b) {
    if (a['type'] != b['type'])
      return name_sorter(a, b);

    let aIndex = NBList._file_order.indexOf(a['name']);
    let bIndex = NBList._file_order.indexOf(b['name']);
    if (aIndex > -1 && bIndex > -1)
      return aIndex < bIndex ? -1 : 1;
    else if (aIndex > -1)
      return -1;
    else if (bIndex > -1)
      return 1;
    return name_sorter(a, b);
  }

  function sort_handler() {
    // Clear sort indications
    $('.sort-action i').removeClass('fa-arrow-up').removeClass('fa-arrow-down');
    $('#ordered-tree i').addClass('fa-arrow-down');

    NBList.sort_function = sort_function;
    NBList.draw_notebook_list(NBList.model_list, NBList.error_msg);
    NBList.sort_id = 'ordered-tree';
  }

  async function get_file_order() {
    let order_file = `${NBList.base_url}files/${NBList.notebook_path}/_file_order`.replace('//', '/');
    try {
      let response = await fetch(order_file);
      if (!response.ok)
        throw new Error('Fetch of file order failed', {cause: response.status});

      NBList._file_order = await response.json();
      $('#ordered_tree').show();
      sort_handler();
    } catch(error) {
      NBList._file_order = undefined;
      $('#ordered_tree').hide();
      if (NBList.sort_id === 'ordered-tree')
        $('#sort-name').click();
      if (error.cause !== 404)
        console.log(error);
    }
  }

  function load_ipython_extension() {
    let buttonContainer = document.querySelector('#sort_buttons');
    buttonContainer.insertAdjacentHTML('afterbegin', `
      <div id="ordered_tree" class="sort_button" style="display: none;">
        <button id="ordered-tree" class="btn btn-xs btn-default sort-action" type="button" aria-label="Sort by Order">
          Order
          <i class="fa"></i>
        </button>
      </div>
    `);
    $('#ordered-tree').click(sort_handler);

    let old_load_list = NBList.load_list;
    NBList.load_list = function() {
      // Correctly binds this in the old function
      old_load_list.apply(NBList);
      get_file_order();
    };
    get_file_order();
  }

  return {
    load_ipython_extension: load_ipython_extension
  };
})
