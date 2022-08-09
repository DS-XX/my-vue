<template>
    <div>
        <el-input v-model="inputValue" type="textarea">

        </el-input>
        <el-button @click="() => answear = judgeGrid()">
            提交
        </el-button>
        <el-card>
            <div v-for="(item,index) in answear" :key="index">
                {{item}}
            </div>
        </el-card>
    </div>
</template>
<script>
import {tranToArray,tranLintToArray} from './filter'
export default {
    name: 'findSameNum',
    data(){
        return{
            inputValue: '[40,10,20,30]\n[100,100,100]\n[37,12,28,9,100,56,80,5,12]',
            answear: '',
        }
    },
    watch:{
        answear(val){
            console.log(val,'answear')
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
        },
        treeJisuan(root){
            if(!root) return false
            let left,right
            if(root.val===2 || root.val ===3){
                left = treeJisuan(root.left)
                right = treeJisuan(root.right)
                return root.val===2 ? (left||right) : (left && right)
            }
            else{
                return root?true:false
            }
        },
        latestTimeCatchTheBus(buses,passengers,capacity){
            let newBus = buses.sort((a,b)=>a-b)
            let newPass = passengers.sort((a,b)=>a-b)
            let arrive = newBus[0] < newPass[0]-1 ? newBus[0] : newPass[0]-1
            let busLong = newBus.length
            let passLong = newPass.length
            let preOut = arrive
            let j = 0;
            for(let i of newBus){
                let leftSite = capacity
                for(;j<passLong;j++){
                    //符合條件的乘客上車
                    if(leftSite>0 && newPass[j]<=i){
                        //當這個人和之前的人之間有間隙時
                        if(newPass[j] - preOut > 1){
                            arrive = newPass[j] - 1
                        }
                        //減少坐位，乘客
                        leftSite--
                        preOut = newPass[j]
                    }
                    //還有坐位時
                    else{
                        if(leftSite > 0 && i - preOut > 0){
                            arrive = i
                        }
                        break
                    }
                }
                if(j>=passLong){
                    if(i === newBus[busLong-1] && leftSite>0 && newBus[busLong-1] - preOut > 0){
                        arrive = newBus[busLong-1]
                    }
                    else if(i < newBus[busLong-1]){
                        arrive = newBus[busLong-1]
                    }
                    break
                }
            }
            return arrive
        },               
        lastTimeNew(buses,passengers,capacity){
            //首先遍历公交的数组，里面循环数组，如果符合条件的上车
            //结束循环后，从后往前找
        },
        deletePing(nums1,nums2,k1,k2){
            let newNums = nums1.map((item,index)=>{
                return Math.abs(item-nums2[index])
            })
            newNums.sort((a,b)=>b-a).push(0)
            const sumDelete = k1 + k2
            let addDelete = 0
            let deleteNum = 0
            let deleteIndex = 0
            let chaju = 0
            const long = newNums.length
            for(let i = 0 ; i < long; i++){
                if(newNums[i] > newNums[i+1]){
                    deleteNum = newNums[i+1]
                    deleteIndex = i+1
                    addDelete += (newNums[i] - newNums[i+1]) * (i+1)
                }    
                if(addDelete >= sumDelete){
                    chaju = addDelete - sumDelete
                    break
                }
            }
            if(addDelete <= sumDelete  && sumDelete !== 0){
                return 0
            }
            let out = 0
            const everyDelete = parseInt(chaju / deleteIndex)
            let lastChaJu = chaju % deleteIndex
            for(let i = 0 ; i < long; i++){
                if(i< deleteIndex){
                    if(lastChaJu>0){
                        out += (deleteNum + everyDelete + 1) ** 2
                        lastChaJu--
                    }
                    else{
                        out += (deleteNum + everyDelete) ** 2
                    }
                }
                else if(i >= deleteIndex){
                    out += newNums[i] ** 2
                }
                if(newNums[i] === 0){
                    break
                }
            }
            return out
        },
        gridJudge(grid){
            let long = grid.length
            for(let i = 0;i<long;i++){
                for(let j = 0;j<long;j++){
                    if(i+j === long-1 || i==j){
                        if(grid[i][j]===0){
                            return false
                        }
                    }
                    else{
                        if(grid[i][j]!==0){
                            return false
                        }
                    }
                }
            }
            return true
        },
        putHouse(n){
            let sum = 1
            function digui(x){
                if(x+2<=n){
                    digui(x+2)
                }
                sum++
                if(x+1<=n){
                    digui(x+1)
                }
            }
            digui(1)
            return sum ** 2
        },
        transArr(val){
            const arr = tranToArray(val)
            const newArr = arr.map((item,index)=>[item,index])
            newArr.sort((a,b)=>a[0]-b[0])
            const out = []
            let lastItem = []
            let addNum = 1
            newArr.forEach((item,index)=>{
                if(item[0] === lastItem[0]){
                    out[item[1]] = out[lastItem[1]]
                    addNum -= 1
                }
                else{
                    out[item[1]] = index + addNum
                    lastItem = item
                }
            })
            return out
        },
        judgeGrid(val){
            let arr = this.inputValue.trim().split(/\n+/g)
            arr = arr.map(item=>{
                return JSON.parse(item)
            })
            let p1,p2,p3,p4
            function lineLong(a,b){
                // if(a[0]===b[0]){
                //     return Math.abs(Math.abs(a[1])-Math.abs(b[1]))
                // }
                // else if(a[1]===b[1]){
                //     return Math.abs(Math.abs(a[0])-Math.abs(b[0]))
                // }
                // else{
                    return (a[0]-b[0])**2 + (a[1]-b[1])**2
                // }
            }
            let lingList = []
            for(let i of arr){
                for(let j of arr){
                    if(i==j){
                        continue
                    }
                    const line = lineLong(i,j)
                    if(!lingList.includes(line)){
                        lingList.push(line)
                    }
                    if(lingList.length>2){
                        return false
                    }
                }
            }
            return true
        },
        muitipleLineOut(){
            const multiArr = tranLintToArray(this.inputValue)
            let out = []
            for(let i of multiArr){
                out.push(this.transArr(i))
            }
            return out
        },
    }
}
</script>