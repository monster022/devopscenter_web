<template>
  <div>
    <div v-for="(item, index) in dataList" :key="index">
      <p>ID: {{ item.id }}</p>
      <p>Env: {{ item.env }}</p>
      <p>Name: {{ item.name }}</p>
      <p>Namespace: {{ item.namespace }}</p>
      <p>Data:</p>
      <ul>
        <li v-for="(dataItem, dataIndex) in parseData(item.data)" :key="dataIndex">
          Key: {{ dataItem.key }} | Value: {{ dataItem.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [
        {
          id: 1,
          env: "",
          name: "dotnet",
          namespace: "",
          data: '[{\"key\":\"ASPNETCORE_ENVIRONMENT\",\"value\":\"FAT\"}]'
        }
      ]
    };
  },
  methods: {
    parseData(data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        return [];
      }
    }
  }
};
</script>
