'use strict';

$(document).on('click', function (event) {
    if($(event.target).has('.galleria').length)
        $('.modal').fadeOut(500);

});

$(function () {
    let $buttonsArr = $('.featured li');

    $.each($buttonsArr, function (i, el) {

        $(el).on('click', function () {

            let $self = $(this);
            if ($self.hasClass('active')) {
                $self.removeClass('active');
            } else {
                $self.siblings().removeClass('active');
                $self.addClass('active');
            }
        });
    });
});




function AppViewModel() {

    let self = this;
    self.currentTag = ko.observable('all');
    self.tagTypes = ko.observableArray();
    self.tagNames = ko.observableArray();

    self.topLeftNavbarData = ko.observableArray();
    self.topRightNavbarData = ko.observableArray();
    self.mainNavbar = ko.observableArray();
    self.itemsCarousel = ko.observableArray();
    self.itemsOffer = ko.observableArray();
    self.itemsCategory = ko.observable();
    self.itemsCategoryModal = ko.observableArray();
    self.itemsFeatured = ko.observable();
    self.itemsAdvantage = ko.observableArray();
    self.itemsBlog = ko.observable();
    self.itemsLogo = ko.observableArray();
    self.itemsFooter = ko.observableArray();

    Galleria.loadTheme('https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js');
    Galleria.configure({
        transition: 'fade',
        imageCrop: true,
        keepSource: true
    });

    self.openGalleriaModal = function(numberImgItems) {
        let API_KEY = '9473991-512a79378af31d26b8ed5c7c0';
        let URL = "https://pixabay.com/api/?key="+API_KEY+"&q="
            + encodeURIComponent('succulents in pot')
            + "&image_type=photo"
            + "&orienation=horizontal"
            + "&category=nature"
            + "&per_page="
            + numberImgItems
            + "&pretty=true";

        $.getJSON(URL, function(data){
            parseInt(data.totalHits, 10) > 0 ? self.itemsCategoryModal(data.hits) :  console.log('No hits');

            Galleria.run('#galleria', {
                dataSource: self.itemsCategoryModal().map(function (el) {
                    return { image: el.largeImageURL }
                })
            });
        });

        let myModal = 'myModal';
        let modal =  document.getElementsByClassName(myModal);
        $(modal).fadeIn(500);


    };

    self.closeModal = function() {
        let modal =  document.getElementsByClassName('modal');
        $(modal[0]).fadeOut(500);
    };

    $.getJSON('assets/json/data.json', function (data) {

        let content = data.homepage.allInfo;
        self.topLeftNavbarData(content.header.topNavbar.leftNav.items);
        self.topRightNavbarData(content.header.topNavbar.rightNav.items);
        self.mainNavbar(content.header.mainNavbar);
        self.itemsCarousel(content.carousel.items);
        self.itemsOffer(content.offers.items);
        self.itemsFeatured(content.featured);
        self.itemsAdvantage(content.advantages.items);
        self.itemsBlog(content.blog);
        self.itemsLogo(content.logos.items);
        self.itemsCategory(content.categories);
        self.itemsFooter(content.footer);

        self.tagTypes(content.featured.items
            .reduce(function (arr, item) {
                return arr.concat(item.itemType);
            }, [])
            .filter(function (item, index, arr) {
                return arr.indexOf(item) === index;
            }));
        self.tagNames(self.tagTypes().map(function (item) {
                /*return (item[0].toUpperCase() + item.slice(1)).replace(/([A-z])([A-Z])/g, '$1 $2');*/
            return {
                title: (item[0].toUpperCase() + item.slice(1)).replace(/([A-z])([A-Z])/g, '$1 $2'),
                active: ko.observable(item)
            }
            })
        );
        //self.itemsFeatured({...self.itemsFeatured(), tagNames: self.tagNames() });
        //Object.assign({},self.itemsFeatured(),{tagNames: self.tagNames()})
    });

    self.showItems = function (tag, i) {
        // TODO: need to make it pretty
        console.log('tag, i',tag, i,self.tagNames()[i]);
        tag === self.currentTag() ? self.currentTag('all') : self.currentTag(tag);
        let temp = [...self.tagNames()];
        temp[i].active(tag);
        self.tagNames(temp);
    };
}

ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        let shouldDisplay = valueAccessor();
        $(element).toggle(shouldDisplay);
    },
    update: function(element, valueAccessor) {
        let shouldDisplay = valueAccessor();
        shouldDisplay ? $(element).show(500) : $(element).hide(500);
    }
};

ko.applyBindings(new AppViewModel());






