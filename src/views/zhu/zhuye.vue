<template>
  <div class="app-container">
        <code>
            <h3>系统说明：</h3>
            <ul>
                <li>
                   本系统包含三个模块，分别是公共管理员，企业技术管理员和审核管理员，每个管理员的权限不同，得到的页面也不同</li>
                <li>
                    公共管理员可以进行方向，节点的增删改操作。
                </li>
                <li>
                    企业技术人员可以对对应方向和方向下的节点进行增删操作，不过需要通过审核员审核才能生效。
                </li>

                <li>
                  企业审核员只有一个职能，就是审核企业技术人员的申请，并给予允许或拒绝的操作。
                </li>
            </ul>
        </code>

  </div>
</template>

<script>

export default {
  data() {
    return {
        
    }
  },
  computed: {
    },
  mounted() {
    
   },
  methods: {
    

  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
    
</style>
