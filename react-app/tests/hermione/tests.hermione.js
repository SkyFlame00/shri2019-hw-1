describe('На всех страницах правильно отображается их содержимое', () => {
  it('Таблица файловой структуры должна появиться на странице', function() {
    return this.browser
      .url('/repos/shri-homework')
      .assertExists('.Table', 'Таблица файловой структуры не появилась')
      .assertView('plain', '.Table');
  });

  it('Содержимое файла должно появиться на странице', function() {
    return this.browser
      .url('/repos/shri-homework/blob/master/react-app/server.js')
      .assertExists('.FileView', 'Содержимое файла не появилось')
      .assertView('plain', '.FileView');
  });
});

describe('Правильно работают переходы по страницам', () => {
  it('Переход из списка файлов во вложенную папку' , function() {
    return this.browser
      .url('/repos/shri-homework/tree/master/react-app')
      .assertExists('.Table', 'Таблица файловой структуры родительской папки не появилась')
      .assertView('parent folder', '.Table')
      .click('.Table-BodyRow:nth-child(2) .Table-BodyCell:first-child a')
      .waitForExist('.Table')
      .assertExists('.Table', 'Таблица файловой структуры дочерней папки не появилась')
      .assertView('child folder', '.Table');
  });

  it('Переход из списка файлов на страницу отдельного файла', function() {
    return this.browser
      .url('/repos/shri-homework/tree/master/react-app/src')
      .assertExists('.Table', 'Таблица файловой структуры не появилась')
      .assertView('folder', '.Table')
      .click('.Table-BodyRow:nth-child(3) .Table-BodyCell:first-child a')
      .waitForExist('.FileView')
      .assertExists('.FileView', 'Содержимое файла не появилось')
      .assertView('file', '.FileView');
  });

  context('Хлебные крошки', function() {
    it('Переход из shri-homework/react-app/src/components/ в shri-homework/react-app/ по хлебным крошкам', function() {
      return this.browser
        .url('/repos/shri-homework/tree/master/react-app/src/components')
        .assertExists('.Breadcrumbs', 'Хлебные крошки не появились')
        .assertExists('.Table', 'Таблица файловой структуры не появилась')
        .assertView('page before clicking breadcrumbs link', '.Layout-Content .Layout-Container:nth-child(2) .Layout-Block')
        .click('.Breadcrumbs-Link:nth-child(2)')
        .waitForExist('.Table')
        .assertExists('.Table', 'Таблица файловой структуры не появилась')
        .assertView('page after clicking breadcrumbs link', '.Layout-Content .Layout-Container:nth-child(2) .Layout-Block');
    });
  
    it('Переход из shri-homework/api/routes/other/ в shri-homework/api/routes/ по хлебным крошкам', function() {
      return this.browser
        .url('/repos/shri-homework/tree/master/api/routes/other')
        .assertExists('.Breadcrumbs', 'Хлебные крошки не появились')
        .assertExists('.Table', 'Таблица файловой структуры не появилась')
        .assertView('page before clicking breadcrumbs link', '.Layout-Content .Layout-Container:nth-child(2) .Layout-Block')
        .click('.Breadcrumbs-Link:nth-child(3 )')
        .waitForExist('.Table')
        .assertExists('.Table', 'Таблица файловой структуры не появилась')
        .assertView('page after clicking breadcrumbs link', '.Layout-Content .Layout-Container:nth-child(2) .Layout-Block');
    });
  });
});