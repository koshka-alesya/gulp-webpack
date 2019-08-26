const filterTriggerList = document.querySelectorAll('.js-filter-trigger');
const classes = {
    isActive: 'is-active'
    }

const toggleClass = (el, className) => {
    if (el.classList.contains(className)) {
        el.classList.remove(classes.isActive);
    } else {
        el.classList.add(className);
    }
}

filterTriggerList.forEach((filterTrigger)=>
{
    filterTrigger.addEventListener('click',(e) => {
        toggleClass(e.currentTarget, classes.isActive);
    } );
})