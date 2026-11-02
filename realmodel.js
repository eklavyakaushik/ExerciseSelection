const viewer = document.getElementById('viewer');

if (viewer) {
  const canvasObserver = new MutationObserver(() => {
    viewer.querySelectorAll('canvas').forEach(canvas => { canvas.style.display = 'none'; });
  });
  canvasObserver.observe(viewer, { childList: true });

  viewer.querySelectorAll('canvas').forEach(canvas => { canvas.style.display = 'none'; });
  document.getElementById('loading')?.remove();
  viewer.classList.add('static-anatomy', 'front-view');

  const muscleTip = document.getElementById('muscle-tip');
  const hotspotLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  hotspotLayer.classList.add('anatomy-hotspots');
  hotspotLayer.setAttribute('viewBox', '0 0 1000 1000');
  hotspotLayer.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  hotspotLayer.setAttribute('aria-label', 'Interactive front and back muscle map');

  // Region outlines follow the anatomy illustration's 1000 x 1000 image coordinates.
  const regions = [
    ['Upper Chest', 'M119 210 Q151 201 189 209 L190 227 Q151 222 110 235 Q109 220 119 210Z'],
    ['Upper Chest', 'M210 209 Q249 201 278 210 Q288 220 288 235 Q249 222 209 227Z'],
    ['Middle Chest', 'M110 238 Q151 225 190 230 L192 248 L189 255 Q146 257 111 250 Q108 244 110 238Z'],
    ['Middle Chest', 'M209 230 Q249 225 288 238 Q290 244 286 250 Q252 257 211 255 L207 248Z'],
    ['Lower Chest', 'M114 254 Q149 260 187 259 Q179 275 162 278 Q135 275 114 254Z'],
    ['Lower Chest', 'M213 259 Q251 260 284 254 Q263 275 238 278 Q222 275 213 259Z'],
    ['Front Delt', 'M100 195 Q111 191 124 195 Q110 207 104 227 L96 245 L87 250 Q89 222 100 195Z'],
    ['Front Delt', 'M276 195 Q289 191 300 195 Q311 222 313 250 L304 245 L296 227 Q290 207 276 195Z'],
    ['Side Delt', 'M96 197 Q79 202 73 221 Q65 244 70 267 L82 254 Q84 224 96 197Z'],
    ['Side Delt', 'M304 197 Q321 202 327 221 Q335 244 330 267 L318 254 Q316 224 304 197Z'],
    ['Side Delt', 'M684 200 Q670 211 665 231 Q659 249 663 269 L675 253 Q676 226 684 200Z'],
    ['Side Delt', 'M916 200 Q930 211 935 231 Q941 249 937 269 L925 253 Q924 226 916 200Z'],
    ['Rear Delt', 'M689 197 Q704 189 722 198 L729 210 Q708 223 681 248 Q680 219 689 197Z'],
    ['Rear Delt', 'M911 197 Q896 189 878 198 L871 210 Q892 223 919 248 Q920 219 911 197Z'],
    ['Biceps Short Head', 'M94 258 Q100 259 102 272 Q102 295 95 314 L87 333 L82 336 L87 308 Q93 284 94 258Z'],
    ['Biceps Short Head', 'M296 258 Q290 259 288 272 Q288 295 295 314 L303 333 L308 336 L303 308 Q297 284 296 258Z'],
    ['Biceps Long Head', 'M86 255 L92 258 Q91 284 85 307 L80 334 L76 337 Q73 316 78 291Z'],
    ['Biceps Long Head', 'M304 255 L298 258 Q299 284 305 307 L310 334 L314 337 Q317 316 312 291Z'],
    ['Brachialis', 'M72 299 L76 295 Q72 320 74 339 L79 345 L73 350 L66 343 Q65 323 72 299Z'],
    ['Brachialis', 'M318 299 L314 295 Q318 320 316 339 L311 345 L317 350 L324 343 Q325 323 318 299Z'],
    ['Forearms', 'M63 353 Q74 366 91 357 Q97 378 87 401 Q76 425 65 445 L42 443 Q43 411 46 391 Q50 368 63 353Z'],
    ['Forearms', 'M337 353 Q326 366 309 357 Q303 378 313 401 Q324 425 335 445 L358 443 Q357 411 354 391 Q350 368 337 353Z'],
    ['Forearms', 'M650 365 Q668 376 684 368 Q687 394 675 421 Q662 445 653 462 L637 459 Q640 424 640 403 Q640 383 650 365Z'],
    ['Forearms', 'M950 365 Q932 376 916 368 Q913 394 925 421 Q938 445 947 462 L963 459 Q960 424 960 403 Q960 383 950 365Z'],
    ['Triceps Long Head', 'M696 259 Q706 266 710 282 Q713 303 702 323 L694 335 L689 332 Q695 311 693 296 Q691 277 696 259Z'],
    ['Triceps Long Head', 'M904 259 Q894 266 890 282 Q887 303 898 323 L906 335 L911 332 Q905 311 907 296 Q909 277 904 259Z'],
    ['Triceps Lateral Head', 'M674 260 Q683 253 693 254 Q692 276 683 292 Q673 298 669 311 L663 321 Q659 314 659 301 Q660 278 674 260Z'],
    ['Triceps Lateral Head', 'M926 260 Q917 253 907 254 Q908 276 917 292 Q927 298 931 311 L937 321 Q941 314 941 301 Q940 278 926 260Z'],
    ['Triceps Medial Head', 'M699 322 Q701 327 696 336 L691 344 Q688 344 689 339 L693 330Z'],
    ['Triceps Medial Head', 'M901 322 Q899 327 904 336 L909 344 Q912 344 911 339 L907 330Z'],
    ['Upper Abs', 'M162 291 Q174 284 188 278 Q193 278 194 285 Q198 301 190 305 Q175 309 160 318 Q155 309 162 291Z'],
    ['Upper Abs', 'M238 291 Q226 284 212 278 Q207 278 206 285 Q202 301 210 305 Q225 309 240 318 Q245 309 238 291Z'],
    ['Middle Abs', 'M161 326 Q175 316 188 313 Q193 312 194 320 L194 342 Q179 347 162 347 Q157 337 161 326Z M162 352 Q178 351 193 348 L193 371 Q188 378 180 379 L166 379 Q161 368 162 352Z'],
    ['Middle Abs', 'M239 326 Q225 316 212 313 Q207 312 206 320 L206 342 Q221 347 238 347 Q243 337 239 326Z M238 352 Q222 351 207 348 L207 371 Q212 378 220 379 L234 379 Q239 368 238 352Z'],
    ['Lower Abs', 'M165 386 Q177 382 186 387 Q188 394 195 396 L197 462 Q196 470 192 468 Q180 450 173 427 Q166 405 165 386Z'],
    ['Lower Abs', 'M235 386 Q223 382 214 387 Q212 394 205 396 L203 462 Q204 470 208 468 Q220 450 227 427 Q234 405 235 386Z'],
    ['Obliques', 'M112 281 Q130 291 151 300 Q149 319 151 339 Q150 356 155 379 Q158 399 153 417 L147 422 Q128 410 124 395 Q119 378 123 357 Q126 342 120 325 Q111 303 112 281Z'],
    ['Obliques', 'M288 281 Q270 291 249 300 Q251 319 249 339 Q250 356 245 379 Q242 399 247 417 L253 422 Q272 410 276 395 Q281 378 277 357 Q274 342 280 325 Q289 303 288 281Z'],
    ['Traps', 'M780 146 Q785 156 791 171 L795 207 L791 214 Q769 211 748 205 L725 197 Q752 184 768 168Z'],
    ['Traps', 'M820 146 L832 168 Q848 184 875 197 L852 205 Q831 211 809 214 L805 207 L809 171 Q815 156 820 146Z'],
    ['Rotator Cuff', 'M727 210 Q743 217 750 235 Q759 254 765 273 Q746 280 723 273 Q708 269 700 255 Q702 243 715 227 Q719 217 727 210Z'],
    ['Rotator Cuff', 'M873 210 Q857 217 850 235 Q841 254 835 273 Q854 280 877 273 Q892 269 900 255 Q898 243 885 227 Q881 217 873 210Z'],
    ['Middle Back', 'M744 198 Q765 204 786 198 Q793 221 794 249 Q796 283 792 315 Q791 319 788 314 Q772 296 760 269 Q748 243 744 219 Q741 206 744 198Z'],
    ['Middle Back', 'M856 198 Q835 204 814 198 Q807 221 806 249 Q804 283 808 315 Q809 319 812 314 Q828 296 840 269 Q852 243 856 219 Q859 206 856 198Z'],
    ['Lats', 'M711 277 Q737 284 763 277 Q770 297 785 317 Q789 321 786 327 Q774 351 762 367 Q758 373 754 376 Q739 370 730 349 Q717 321 712 294 Q710 285 711 277Z'],
    ['Lats', 'M889 277 Q863 284 837 277 Q830 297 815 317 Q811 321 814 327 Q826 351 838 367 Q842 373 846 376 Q861 370 870 349 Q883 321 888 294 Q890 285 889 277Z'],
    ['Lower Lats', 'M727 321 Q746 335 773 338 Q767 355 755 373 Q741 367 734 350 Q729 336 727 321Z'],
    ['Lower Lats', 'M873 321 Q854 335 827 338 Q833 355 845 373 Q859 367 866 350 Q871 336 873 321Z'],
    ['Lower Back', 'M781 345 L793 340 L795 389 L786 396 Q773 391 759 387 L775 364Z'],
    ['Lower Back', 'M807 340 L819 345 L825 364 L841 387 Q827 391 814 396 L805 389Z'],
    ['Glutes', 'M722 418 Q731 404 747 403 Q772 405 787 426 Q797 446 795 470 Q792 489 777 499 Q754 507 733 510 Q727 493 727 475 Q721 457 719 442 Q717 429 722 418Z'],
    ['Glutes', 'M878 418 Q869 404 853 403 Q828 405 813 426 Q803 446 805 470 Q808 489 823 499 Q846 507 867 510 Q873 493 873 475 Q879 457 881 442 Q883 429 878 418Z'],
    ['Adductors', 'M158 469 Q174 475 188 483 Q194 495 194 516 Q191 557 184 585 Q179 556 172 529 Q166 496 158 469Z'],
    ['Adductors', 'M242 469 Q226 475 212 483 Q206 495 206 516 Q209 557 216 585 Q221 556 228 529 Q234 496 242 469Z'],
    ['Vastus Lateralis', 'M110 451 Q103 477 103 514 L105 563 Q108 608 125 630 L130 614 Q117 569 116 529 L119 489Z'],
    ['Vastus Lateralis', 'M290 451 Q297 477 297 514 L295 563 Q292 608 275 630 L270 614 Q283 569 284 529 L281 489Z'],
    ['Rectus Femoris', 'M132 470 Q145 482 151 505 Q159 529 159 551 Q158 574 146 589 Q135 585 128 566 Q117 540 117 513 Q119 486 132 470Z'],
    ['Rectus Femoris', 'M268 470 Q255 482 249 505 Q241 529 241 551 Q242 574 254 589 Q265 585 272 566 Q283 540 283 513 Q281 486 268 470Z'],
    ['Vastus Medialis', 'M162 545 Q175 560 183 581 Q190 601 180 627 Q175 641 166 650 Q156 639 151 621 Q142 600 149 579 Q154 559 162 545Z'],
    ['Vastus Medialis', 'M238 545 Q225 560 217 581 Q210 601 220 627 Q225 641 234 650 Q244 639 249 621 Q258 600 251 579 Q246 559 238 545Z'],
    ['Hamstrings', 'M716 522 Q750 518 786 506 Q789 539 783 576 Q779 605 770 630 L764 644 Q754 630 751 616 Q740 637 724 650 Q717 619 712 582 Q709 550 716 522Z'],
    ['Hamstrings', 'M884 522 Q850 518 814 506 Q811 539 817 576 Q821 605 830 630 L836 644 Q846 630 849 616 Q860 637 876 650 Q883 619 888 582 Q891 550 884 522Z'],
    ['Gastrocnemius Lateral Head', 'M730 677 Q716 688 712 710 Q704 736 713 758 Q721 776 732 775 L741 758 Q745 734 740 709Z'],
    ['Gastrocnemius Lateral Head', 'M870 677 Q884 688 888 710 Q896 736 887 758 Q879 776 868 775 L859 758 Q855 734 860 709Z'],
    ['Gastrocnemius Medial Head', 'M744 668 Q758 673 770 691 Q781 713 782 739 Q782 766 772 781 Q761 776 755 757 Q748 736 747 714 Q746 688 744 668Z'],
    ['Gastrocnemius Medial Head', 'M866 668 Q852 673 840 691 Q829 713 828 739 Q828 766 838 781 Q849 776 855 757 Q862 736 863 714 Q864 688 866 668Z'],
    ['Soleus', 'M717 770 L729 783 L735 807 L741 844 L733 844 L724 815Z'],
    ['Soleus', 'M770 790 L780 776 L777 813 L769 846 L763 846 L765 814Z'],
    ['Soleus', 'M891 777 L889 797 L883 821 L876 846 L871 846 L876 820 L882 795 L885 782Z']
  ];

  function setRegionHighlight(region, active) {
    const group = region.dataset.group;
    const targets = group === 'Traps' || group === 'Middle Back' || group === 'Rotator Cuff'
      ? [...hotspotLayer.querySelectorAll('path')].filter(path => path.dataset.group === group)
      : [region];
    targets.forEach(path => path.classList.toggle('active', active));
  }

  for (const [group, pathData] of regions) {
    const region = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    region.classList.add('anatomy-hotspot');
    region.dataset.group = group;
    region.setAttribute('d', pathData);
    if (group === 'Traps') {
      region.setAttribute('transform', 'translate(0 -10)');
    }
    region.setAttribute('tabindex', '0');
    region.setAttribute('role', 'button');
    region.setAttribute('aria-label', `Highlight ${group}`);
    region.addEventListener('pointerenter', event => {
      event.stopPropagation();
      setRegionHighlight(region, true);
      const bounds = viewer.getBoundingClientRect();
      muscleTip.textContent = group.replace(/^Triceps /, '');
      muscleTip.style.display = 'block';
      const useGap = ['Rotator Cuff', 'Middle Back', 'Lats', 'Lower Lats', 'Lower Abs', 'Obliques', 'Forearms', 'Adductors', 'Rectus Femoris', 'Vastus Medialis', 'Glutes'].includes(group) || group.startsWith('Triceps ') || group.startsWith('Gastrocnemius ') || group === 'Soleus';
      const imageSide = Math.min(bounds.width, bounds.height);
      muscleTip.style.maxWidth = `${Math.max(1, Math.min(bounds.width - 16, useGap ? Math.max(80, imageSide * .22) : 180))}px`;
      muscleTip.style.overflowWrap = 'anywhere';
      if (useGap) {
        muscleTip.style.left = `${(bounds.width - muscleTip.offsetWidth) / 2}px`;
        muscleTip.style.top = `${Math.max(12, Math.min(event.clientY - bounds.top - muscleTip.offsetHeight / 2, bounds.height - muscleTip.offsetHeight - 8))}px`;
      } else {
        muscleTip.style.left = `${Math.max(8, Math.min(event.clientX - bounds.left + 12, bounds.width - muscleTip.offsetWidth - 8))}px`;
        muscleTip.style.top = `${Math.max(8, Math.min(event.clientY - bounds.top - muscleTip.offsetHeight - 10, bounds.height - muscleTip.offsetHeight - 8))}px`;
      }
    });
    region.addEventListener('pointerleave', () => {
      setRegionHighlight(region, false);
      muscleTip.style.display = 'none';
    });
    region.addEventListener('focus', () => setRegionHighlight(region, true));
    region.addEventListener('blur', () => setRegionHighlight(region, false));
    region.addEventListener('click', event => {
      event.stopPropagation();
      window.location.href = `exercises.html?muscle=${encodeURIComponent(group)}`;
    });
    region.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        region.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
    hotspotLayer.append(region);
  }

  viewer.append(hotspotLayer);
  const fitOverlay = () => {
    const side = Math.min(viewer.clientWidth, viewer.clientHeight);
    hotspotLayer.style.width = `${side}px`;
    hotspotLayer.style.height = `${side}px`;
  };
  new ResizeObserver(fitOverlay).observe(viewer);
  fitOverlay();

}
