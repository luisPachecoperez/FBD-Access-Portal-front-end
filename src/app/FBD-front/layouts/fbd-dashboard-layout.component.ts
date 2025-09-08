import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
  selector:'app-fbd-dashboard-layout',
  templateUrl:'./fbd-dashboard-layout.component.html',
  styleUrls:['./fbd-dashboard-layout.component.css'],
  imports:[CommonModule]
})
export class FbdDashboardLayoutComponent {
  users = [
    {
      name: 'Elnora Hart',
      role: 'Full Stack Developer',
      team: 'Engineering',
      location: 'Melbourne, AU',
      avatar: 'https://i.pravatar.cc/100?img=1',
      online: true
    },
    {
      name: 'Cordelia Hansen',
      role: 'Creative Director',
      team: 'Creative Services',
      location: 'Lisbon, PT',
      avatar: 'https://i.pravatar.cc/100?img=2',
      online: true
    },
    {
      name: 'Donald Walker',
      role: 'VP of Design',
      team: 'Creative Services',
      location: 'Lisbon, PT',
      avatar: 'https://i.pravatar.cc/100?img=3',
      online: false
    }
    // Agrega más usuarios según sea necesario
  ];
}
