<template>
    <div>
        <Table border :data="flitters" :columns="tableColumnsFilters" stripe></Table>
    </div>
</template>

<script>
// https://github.com/azhengyongqin/iview-filter-table
export default {
  name: 'super_table',
  props: {
    columns: Array,
    datat: Array
  },
  data () {

  }
}
</script>
