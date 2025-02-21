<template>

</template>

<script setup lang='ts' name=''>
import { ref, reactive} from 'vue' 
import { getMedicineRelation } from '@/utils/useGetMedicineRelation'

let a = await getMedicineRelation(1)
console.log(a)

</script>
<style scoped>

</style>