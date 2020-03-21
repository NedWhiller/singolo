
var menuElems = document.querySelectorAll('nav a');
Array.prototype.forEach.call(menuElems, function(item){
	item.addEventListener('click', function(e) {
		e.preventDefault();
		document.querySelector('nav li.active').classList.remove('active');
		item.parentNode.classList.add('active');
		goTo(item);
	})
})

var screens = document.querySelectorAll('.phone-back');
Array.prototype.forEach.call(screens, function(item){
	item.addEventListener('click', function(e) {
		toggleClass(item, 'disabled');
	})
})

var images = document.querySelectorAll('.image');
Array.prototype.forEach.call(images, function(item) {
	item.addEventListener('click', function(){
		var focusImage = document.querySelector('.image.focus');
		if (focusImage) {
			document.querySelector('.image.focus').classList.remove('focus');
		}
		this.classList.add('focus');
	})
})


var popupCurrent = document.querySelector('.popup'),
	defaultSub = popupCurrent.querySelector('.theme').innerHTML,
	defaultTxt = popupCurrent.querySelector('.desc').innerHTML;

document.querySelector('form').addEventListener('submit', function(e) {
	e.preventDefault();
	var subject = this.querySelector('input[name="subject"]'),
		theme = popupCurrent.querySelector('.theme'),
		desc = popupCurrent.querySelector('.desc'),
		text = this.querySelector('textarea');
		subject.value ? theme.innerText = 'Тема: ' + subject.value : theme.innerText = defaultSub;
		text.value ? desc.innerText = 'Описание: ' + text.value : desc.innerText = defaultTxt;
		popup(popupCurrent);
	this.reset();	
})

document.querySelector('.close').addEventListener('click', function() {
	popup('','close');
})

slider();
changePortfolio();

function goTo(el) {
	var goElem = document.querySelector(el.getAttribute('href')),
		val = getCoords(goElem).top;
		goElem.scrollIntoView({block: "center", behavior: "smooth"});
}

function toggleClass(elem, classes) {
	return elem.classList.contains(classes) ? elem.classList.remove(classes) : elem.classList.add(classes);
}

function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

function slider() {
	var buttons = document.querySelectorAll('.slide-button'),
		slideWrapper = document.querySelector('.slides'),
		slides = document.querySelectorAll('.slide-item'),
		slideOuter = document.createElement('div');

	slides[0].setAttribute('data-slide','first');
	slides[slides.length - 1].setAttribute('data-slide','last');
	slideWrapper.classList.add('slide-wrapper');
	slideOuter.classList.add('slide-outer');
	slideOuter.style.width = 'calc(100% * ' + slides.length + ')';
	slideWrapper.parentNode.insertBefore(slideOuter, slideWrapper);
	slideWrapper.appendChild(slideOuter);

	Array.prototype.forEach.call(slides, function(el) {
		el.style.width = 'calc(100% / ' + slides.length + ')';
		slideOuter.appendChild(el);
	})	

	Array.prototype.forEach.call(buttons, function(button) {

		button.addEventListener('click', function(){
			var mode;

			if (this.classList.contains('slide-next')) {
				mode = 'next';
			} else {
				mode = 'prev';
			}

			changeSlide(mode);
		})
	})

	function changeSlide(mode) {

		var slide = document.querySelector('.slide-item.active'),
			pevSlide = slide.previousElementSibling,
			nextSlide = slide.nextElementSibling,
			slideWidth = slide.offsetWidth,
			wrapperWidth = slideOuter.offsetWidth,
			wrapperTranslateX = getTranslate(slideOuter)[0];

		if (mode == 'next' && nextSlide) {
			slideOuter.style.transform = 'translateX(-' + (Math.abs(wrapperTranslateX) + slideWidth) + 'px)';
			nextSlide.classList.add('active');
		} else if (mode == 'next' && nextSlide == null) {
			slideOuter.style.transform = 'translateX(0)';
			slides[0].classList.add('active');
		}
		if (mode == 'prev' && pevSlide) {
			slideOuter.style.transform = 'translateX(' + (wrapperTranslateX + slideWidth) + 'px)';
			pevSlide.classList.add('active');
		} else if (mode == 'prev' && pevSlide == null) {
			slideOuter.style.transform = 'translateX( -' + (wrapperWidth - slideWidth)+ 'px)';
			slides[slides.length - 1].classList.add('active');
		}

		slide.classList.remove('active');
	}
	
}

function getTranslate(item) {
    var transArr = [];

    if (!window.getComputedStyle) return;
    var style     = getComputedStyle(item),
        transform = style.transform || style.webkitTransform || style.mozTransform || style.msTransform;
    var mat       = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) return parseFloat(mat[1].split(', ')[13]);

    mat = transform.match(/^matrix\((.+)\)$/);
    mat ? transArr.push(parseFloat(mat[1].split(', ')[4])) : transArr.push(0);
    mat ? transArr.push(parseFloat(mat[1].split(', ')[5])) : transArr.push(0);

    return transArr;
}

function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function changePortfolio() {
	var navs = document.querySelectorAll('.protfolio-nav button'),
		tags = [],
		images = document.querySelectorAll('.protfolio-item'),
		wrapper = document.querySelector('.portfolio-wrapp'),
		numbers = [],
		imageTotal = images.length;

	Array.prototype.forEach.call(navs, function(nav, i) {
		var tag = nav.getAttribute('data-tag');
		tag != 'all' ? tags.push(tag) : '';
	});

	for(var i = 0; i < imageTotal; i++) {
		numbers.push(i);
	}

	numbers = shuffle(numbers);

	setTags();

	Array.prototype.forEach.call(navs, function(item) {
		item.addEventListener('click', function() {
			document.querySelector('.protfolio-nav button.active').classList.remove('active');
			var tag = this.getAttribute('data-tag');
			wrapper.classList.add('disabled');
			this.classList.add('active');

			setTimeout(function(){
				Array.prototype.forEach.call(images, function(image) {
					if (tag == 'all') {
						image.classList.remove('disabled');
					} else {
						if (image.getAttribute('data-tag') != tag) {
							image.classList.add('disabled');
						} else {
							image.classList.remove('disabled');
						}
					}
				})

				wrapper.classList.remove('disabled');
			},600)
		})
	});

	function setTags() {
		var step = 1,
			iterator = 0;
		numbers.forEach(function(item, i) {
			if(step <= imageTotal / tags.length) {
				step += 1;
			} else {
				iterator += 1;
				step = 1;
			}
			images[item].setAttribute('data-tag', tags[iterator]);
		})
	}

}

function popup(popup, mode) {
    if (mode == 'close') {
        Array.prototype.forEach.call(document.querySelectorAll('.popup'), function(item) {
            item.parentNode.classList.remove('active');
        })
        return;
    }
    popup.parentNode.classList.add('active');
}
