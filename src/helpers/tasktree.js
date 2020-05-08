export function findBlockInTasktree(theObject, blockId) {
    let result = null;
    if(theObject instanceof Array) {
        for(let i = 0; i < theObject.length; i++) {
            result = findBlockInTasktree(theObject[i], blockId);
            if (result) {
                break;
            }
        }
    }
    else
    {
        for(let prop in theObject) {
            if(prop === 'section_url') {
                if(theObject[prop] === blockId) {
                    return theObject;
                }
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                result = findBlockInTasktree(theObject[prop], blockId);
                if (result) {
                    break;
                }
            }
        }
    }
    return result;
}
export function findParentBlockInTasktree(tasktree, blockId) {
    let result = undefined;
    if("child_info" in tasktree){
        result = tasktree.child_info.children.find(x => x.section_url = blockId);
        if (result === undefined) {
            tasktree.child_info.children.forEach(element => {
                result = findParentBlockInTasktree(element.section_url);
            });
        } else {
            return tasktree;
        }
    }
    return result
}
