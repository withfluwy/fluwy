// Reexport your entry components here
import * as component from './components.js';
import { createApp } from './core/app/index.js';

const app = createApp();

// app.registerComponent('authenticated-user', component.AuthenticatedUser);
// app.registerComponent('avatar', component.Avatar);
app.registerComponent('button', component.Button);
// app.registerComponent('center', component.Center);
// app.registerComponent('checkbox', component.form.Checkbox);
// app.registerComponent('column', component.Column);
// app.registerComponent('dialog', component.dialog.Dialog);
// app.registerComponent('div', component.Div);
// app.registerComponent('dropdown-item', component.dropdown.DropdownItem);
// app.registerComponent('dropdown-label', component.dropdown.DropdownLabel);
// app.registerComponent('dropdown-separator', component.dropdown.DropdownSeparator);
// app.registerComponent('dropdown-sub', component.dropdown.DropdownSub);
// app.registerComponent('dropdown', component.dropdown.Dropdown);
// app.registerComponent('form', component.form.Form);
// app.registerComponent('header', component.Header);
// app.registerComponent('icon', component.Icon);
// app.registerComponent('if', component.If);
// app.registerComponent('input', component.form.Input);
// app.registerComponent('login', component.Login);
// app.registerComponent('main', component.Main);
// app.registerComponent('page_title', component.PageTitle);
// app.registerComponent('page', component.Page);
// app.registerComponent('pagination', component.table.Pagination);
// app.registerComponent('pre', component.Pre);
// app.registerComponent('row', component.Row);
// app.registerComponent('search', component.Search);
// app.registerComponent('shortcut', component.Shortcut);
// app.registerComponent('sidenav-toggle', component.SidenavToggle);
// app.registerComponent('sidenav', component.Sidenav);
// app.registerComponent('table', component.table.Table);
// app.registerComponent('text', component.Text);
// app.registerComponent('topnav', component.Topnav);

export { app };
