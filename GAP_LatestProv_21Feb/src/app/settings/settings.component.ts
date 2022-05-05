import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';

interface SettingsNode {
  name: string;
  children?: SettingsNode[];
  expanded: boolean;
}

const TREE_DATA: SettingsNode[] = [
  {
    name: 'Welcome Page',
    expanded: false
  },
  {
    name: 'Support',
    children: [
      {
        name: 'FAQs',
        expanded: false
      },
      {
        name: 'Technical Docs',
        children: [
          {
            name: 'Drift',
            expanded: false
          },
          {
            name: 'Explainability',
            expanded: false
          },
          {
            name: 'Models',
            expanded: false
          },
          {
            name: 'Preprocessed',
            expanded: false
          },
          {
            name: 'Persona',
            expanded: false
          },
          {
            name: 'Provenance',
            expanded: false
          },
        ],
        expanded: false
      },
      {
        name: 'Provide Feedback',
        expanded: false
      }
    ],
    expanded: false
  },
  {
    name: 'Invite',
    expanded: false
  }
];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  treeControl = new NestedTreeControl<SettingsNode>(node => node.children);
  treeSource = new MatTreeNestedDataSource<SettingsNode>();
  activeNode = {name: 'Welcome Page', expanded: false};
  showCallEmailSupport: boolean;
  showFaq: boolean;
  pageName = 'Welcome Page';
  showInvite: boolean;
  showTD: boolean;
  welcome = true;
  tdType: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.treeSource.data = TREE_DATA;
    this.pageName = this.activatedRoute.snapshot.queryParams.name || 'Welcome Page';
    if (this.pageName) {
    this.getSettingsDetails(this.pageName);
    }
   }

   hasChild = (_: number, node: SettingsNode) => !!node.children && node.children.length > 0;

   changeState(node) {
    node.expanded = !node.expanded;
  }

  setActiveNode(node) {
    this.activeNode = node;
  }

  ngOnInit(): void {
  }

  getSettingsDetails(event) {
    const selectedTree = event;
    if (selectedTree === 'FAQs') {
      this.showFaq = true;
      this.showCallEmailSupport = false;
      this.showInvite = false;
      this.showTD = false;
      this.welcome = false;
      this.pageName = 'Support - FAQ';
      this.treeSource.data[1].expanded = true;
      this.activeNode = {name: 'FAQs', expanded: false};
    } else if (selectedTree === 'Provide Feedback') {
      this.showFaq = false;
      this.showCallEmailSupport = true;
      this.showInvite = false;
      this.showTD = false;
      this.welcome = false;
      this.pageName = 'Support - Provide Feedback';
      this.treeSource.data[1].expanded = true;
      this.activeNode = {name: 'Provide Feedback', expanded: false};
    } else if (selectedTree === 'Invite') {
      this.showFaq = false;
      this.showCallEmailSupport = false;
      this.showInvite = true;
      this.showTD = false;
      this.welcome = false;
      this.pageName = 'Invite';
    } else if (selectedTree === 'Drift') {
      this.showFaq = false;
      this.showCallEmailSupport = false;
      this.showInvite = false;
      this.showTD = true;
      this.tdType = 'Drift';
      this.welcome = false;
      this.pageName = 'Support - Technical Docs - Drift';
      this.treeSource.data[1].expanded = true;
      this.treeSource.data[1].children[1].expanded = true;
      this.activeNode = {name: 'Drift', expanded: false};
    } else if (selectedTree === 'Explainability') {
      this.showFaq = false;
      this.showCallEmailSupport = false;
      this.showInvite = false;
      this.showTD = true;
      this.tdType = 'Explainability';
      this.welcome = false;
      this.pageName = 'Support - Technical Docs - Explainability';
      this.treeSource.data[1].expanded = true;
      this.treeSource.data[1].children[1].expanded = true;
      this.activeNode = {name: 'Explainability', expanded: false};
    } else if (selectedTree === 'Models') {
      this.showFaq = false;
      this.showCallEmailSupport = false;
      this.showInvite = false;
      this.showTD = true;
      this.tdType = 'Models';
      this.welcome = false;
      this.pageName = 'Support - Technical Docs - Models';
      this.treeSource.data[1].expanded = true;
      this.treeSource.data[1].children[1].expanded = true;
      this.activeNode = {name: 'Models', expanded: false};
    } else if (selectedTree === 'Preprocessed') {
      this.showFaq = false;
      this.showCallEmailSupport = false;
      this.showInvite = false;
      this.showTD = true;
      this.tdType = 'Preprocessed';
      this.welcome = false;
      this.pageName = 'Support - Technical Docs - Preprocessed';
      this.treeSource.data[1].expanded = true;
      this.treeSource.data[1].children[1].expanded = true;
      this.activeNode = {name: 'Preprocessed', expanded: false};

    } else if (selectedTree === 'Persona') {
      this.showFaq = false;
      this.showCallEmailSupport = false;
      this.showInvite = false;
      this.showTD = true;
      this.tdType = 'Persona';
      this.welcome = false;
      this.pageName = 'Support - Technical Docs - Persona';
      this.treeSource.data[1].expanded = true;
      this.treeSource.data[1].children[1].expanded = true;
      this.activeNode = {name: 'Persona', expanded: false};
    } else if (selectedTree === 'Provenance') {
      this.showFaq = false;
      this.showCallEmailSupport = false;
      this.showInvite = false;
      this.showTD = true;
      this.tdType = 'Provenance';
      this.welcome = false;
      this.pageName = 'Support - Technical Docs - Provenance';
      this.treeSource.data[1].expanded = true;
      this.treeSource.data[1].children[1].expanded = true;
      this.activeNode = {name: 'Provenance', expanded: false};

    } else if (selectedTree === 'Welcome Page') {
      this.welcome = true;
      this.showFaq = false;
      this.showCallEmailSupport = false;
      this.showInvite = false;
      this.showTD = false;
      this.pageName = 'Welcome Page';
    }
  }

}
