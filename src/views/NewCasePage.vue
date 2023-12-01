<template>
    <new-case-form />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import NewCaseForm from '@/components/NewCaseForm.vue'

@Component({
    components: {
        NewCaseForm
    }
})
export default class NewCasePage extends Vue {
    
}

</script>


<style lang="scss" scoped>

</style>