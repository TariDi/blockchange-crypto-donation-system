<template>
    <div class="charity-layout">
        <div v-for="(item, index) in numberOfCharities" :key="index">
            <charity-card />
        </div>
    </div>
    
</template>

<script lang="ts">
import CharityCard from './CharityCard.vue'
import { Component, Vue } from 'vue-facing-decorator'

@Component({
    components: {
        CharityCard
    }
})
export default class CharityLayout extends Vue {
    numberOfCharities = 20
}

</script>

<style lang="scss" scoped>

.charity-layout {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 48px;
}


</style>