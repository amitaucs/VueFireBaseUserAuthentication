<template>
    <div id="dashboard">
        <h1>That's the Talkeng user details !</h1>
        <p>Welcome to TalkEng !</p>
        <p v-if="email">Your email address is : {{ email }}</p>
        <p v-if="preLunchCoupon">Your pre lunch coupon is : {{ preLunchCoupon }}</p>
        <p v-if="referralCoupon">Your referral is : {{ referralCoupon }}</p>
    </div>
</template>

<script>

    export default {
        computed: {
            email() {
                return !this.$store.getters.user? false : this.$store.getters.user.email
            },
            preLunchCoupon() {
              return !this.$store.getters.user? false : this.$store.getters.user.preLunchCoupon
            },
           referralCoupon() {
              return !this.$store.getters.user? false : this.$store.getters.user.referralCoupon
            }
        }
    }
</script>

<style scoped>
    h1, p {
        text-align: center;
    }

    p {
        color: red;
    }
</style>
