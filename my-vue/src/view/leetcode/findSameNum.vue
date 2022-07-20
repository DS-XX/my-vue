<template>
    
</template>
<script>
export default {
    name: 'findSameNum',
    data(){
        return{

        }
    },
    methods:{
        findNumber(arr){
            let hash = new Map()
            for(let i of arr){
                if(!hash.has(i)){
                    hash.set(i,1)
                }
                else{
                    hash.set(i,hash.get(i)+1)
                }   
            }
            let out = [0,0]
            hash.forEach(item=>{
                out[0] += parseInt(item / 2)
                out[1] += item % 2
            })
            return out
        },
        getMax(nums){
            function addAll(value){
                let out = 0
                while(value>0){
                    out += value % 10
                    value = parseInt(value / 10)
                }
                return out
            }
            let hash = new Map()
            for(let i of nums){
                let num = addAll(i)
                if(!hash.has(num)){
                    hash.set(num,[i])
                }
                else{
                    hash.set(num,[...hash.get(num),i])
                }
            }
            let max = -1
            hash.forEach(item=>{
                let max1 = 0
                let max2 = 0
                for(let i of item){
                    if(i>max1){
                        max2 = max1
                        max1 = i
                    }
                    else if(i>max2){
                        max2 = i
                    }
                }
                if(max1>0 && max2>0){
                    if(max < (max1+max2)){
                        max = (max1+max2)
                    }
                }
            })
            return max
        },
        reverNext(head){
            let newHead = null
            while(head){
                let nextNode = head.next
                head.next = newHead
                newHead = head
                head = nextNode
            }
        },
        copyLink(head){
                if(!head) return null
                let newHead = new ListNode(head.val,null,null)
                let linkNode = newHead
                function setRandom(node,linkNode){
                    let nextNode = head
                    let val
                    while(nextNode){
                        if(node.random === nextNode){
                            val = nextNode.val
                            break
                        }
                        nextNode = nextNode.next
                    }
                    let newLinkNode = newHead
                    while(newLinkNode){
                        if(newLinkNode.val === val){
                            linkNode.random = newLinkNode
                            return 
                        }
                        newLinkNode = newLinkNode.next
                    }
                }
                function createLink(linkNode,node){
                    if(node){
                        if(!node.next){
                            linkNode.next = null
                        }
                        else{
                            linkNode.next = new ListNode(node.next.val,null,null)
                        }
                        createLink(linkNode.next,node.next)
                        setRandom(node,linkNode)
                    }
                }
                createLink(linkNode,head)
                return newHead
        }
    }
}
</script>