const muscleAtlas={
 Chest:'Upper chest · middle chest · lower chest · inner chest',
 Shoulders:'Front deltoid · side deltoid · rear deltoid',
 Biceps:'Long head · short head · brachialis',
 Triceps:'Long head · lateral head · medial head',
 Abs:'Upper abs · middle abs · lower abs · obliques',
 Back:'Upper back · middle back · lats · lower back · traps',
 Glutes:'Glute max · glute medius · upper glute · lower glute',
 Quads:'Rectus femoris · vastus lateralis · vastus medialis',
 Hamstrings:'Biceps femoris · semitendinosus · semimembranosus',
 Calves:'Gastrocnemius medial · gastrocnemius lateral · soleus'
};
function installMuscleAtlas(){const note=document.querySelector('.exercise-panel>p');const buttons=[...document.querySelectorAll('#muscle-list button')];if(!note||!buttons.length)return;let current='Chest';const show=g=>{current=g;note.textContent=muscleAtlas[g]||'Select a muscle to see its main regions.'};buttons.forEach(b=>{const g=b.textContent.trim();b.title=muscleAtlas[g]||g;b.addEventListener('mouseenter',()=>show(g));b.addEventListener('mouseleave',()=>show(current));});const original=window.selectMuscle;window.selectMuscle=g=>{original(g);show(g)};show(current)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installMuscleAtlas);else installMuscleAtlas();
